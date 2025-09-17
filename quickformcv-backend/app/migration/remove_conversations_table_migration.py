#!/usr/bin/env python3
"""
Migration script to remove the 'conversations' table from the database.

This script handles both local and production environments and includes
safety checks to prevent accidental data loss.
"""

import os
import sys
import argparse
from typing import Dict
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker

def load_environment_config(env_type: str) -> Dict[str, str]:
    """Load environment configuration based on environment type."""
    if env_type == "local":
        env_filename = ".env.local"
    elif env_type == "prod":
        env_filename = ".env"
    else:
        raise ValueError("Environment type must be 'local' or 'prod'")

    # Look for env file in current directory, parent directory, and project root
    possible_paths = [
        env_filename,  # Current directory
        os.path.join("..", env_filename),  # Parent directory
        os.path.join("..", "..", env_filename),  # Project root (if running from subdirectory)
    ]

    env_file = None
    for path in possible_paths:
        if os.path.exists(path):
            env_file = path
            break

    if not env_file:
        raise FileNotFoundError(f"Environment file {env_filename} not found in any of these locations: {possible_paths}")

    print(f"Using environment file: {os.path.abspath(env_file)}")
    load_dotenv(env_file)

    required_vars = [
        "POSTGRES_USER", "POSTGRES_PASSWORD",
        "POSTGRES_SERVER", "POSTGRES_PORT", "POSTGRES_DB"
    ]

    config = {}
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            raise ValueError(f"Required environment variable {var} not found in {env_file}")
        config[var] = value

    return config

def create_database_connection(config: Dict[str, str]):
    """Create database connection using the provided configuration."""
    database_url = (
        f"postgresql://{config['POSTGRES_USER']}:{config['POSTGRES_PASSWORD']}"
        f"@{config['POSTGRES_SERVER']}:{config['POSTGRES_PORT']}/{config['POSTGRES_DB']}"
    )

    engine = create_engine(database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    return engine, SessionLocal

def get_table_info(engine, table_name: str) -> Dict[str, any]:
    """Get information about a table including row count and dependencies."""
    inspector = inspect(engine)

    # Check if table exists
    table_exists = table_name in inspector.get_table_names()

    if not table_exists:
        return {
            'exists': False,
            'row_count': 0,
            'foreign_keys': [],
            'referenced_by': []
        }

    # Get row count
    with engine.connect() as conn:
        result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
        row_count = result.scalar()

    # Get foreign key constraints
    foreign_keys = inspector.get_foreign_keys(table_name)

    # Get tables that reference this table
    referenced_by = []
    all_tables = inspector.get_table_names()

    for other_table in all_tables:
        if other_table != table_name:
            fks = inspector.get_foreign_keys(other_table)
            for fk in fks:
                if fk['referred_table'] == table_name:
                    referenced_by.append({
                        'table': other_table,
                        'constraint_name': fk['name'],
                        'columns': fk['constrained_columns']
                    })

    return {
        'exists': True,
        'row_count': row_count,
        'foreign_keys': foreign_keys,
        'referenced_by': referenced_by
    }

def backup_table(session, table_name: str, backup_filename: str = None) -> str:
    """Create a backup of the table data to a SQL file."""
    if not backup_filename:
        backup_filename = f"{table_name}_backup_{int(__import__('time').time())}.sql"

    try:
        # Get table structure
        result = session.execute(text(f"""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = '{table_name}'
            ORDER BY ordinal_position
        """))

        columns = result.fetchall()

        if not columns:
            print(f"No columns found for table {table_name}")
            return backup_filename

        # Get table data
        data_result = session.execute(text(f"SELECT * FROM {table_name}"))
        rows = data_result.fetchall()

        # Write backup file
        with open(backup_filename, 'w', encoding='utf-8') as f:
            f.write(f"-- Backup of table '{table_name}'\n")
            f.write(f"-- Created at: {__import__('datetime').datetime.now()}\n\n")

            if rows:
                column_names = [col[0] for col in columns]
                f.write(f"-- Table data ({len(rows)} rows)\n")

                for row in rows:
                    values = []
                    for i, value in enumerate(row):
                        if value is None:
                            values.append('NULL')
                        elif isinstance(value, str):
                            # Escape single quotes
                            escaped_value = value.replace("'", "''")
                            values.append(f"'{escaped_value}'")
                        else:
                            values.append(str(value))

                    f.write(f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES ({', '.join(values)});\n")
            else:
                f.write(f"-- No data found in table '{table_name}'\n")

        print(f"Backup created: {backup_filename}")
        return backup_filename

    except Exception as e:
        print(f"Error creating backup: {str(e)}")
        raise

def remove_conversations_table(session, table_name: str = "conversations",
                               create_backup: bool = True, dry_run: bool = True) -> Dict[str, any]:
    """
    Remove the conversations table from the database.

    Args:
        session: Database session
        table_name: Name of the table to remove (default: "conversations")
        create_backup: Whether to create a backup before removal
        dry_run: If True, only show what would be done without making changes

    Returns:
        Dictionary with operation results
    """
    result = {
        'success': False,
        'table_existed': False,
        'backup_created': None,
        'dependencies_found': [],
        'error': None
    }

    try:
        # Get engine from session
        engine = session.get_bind()

        # Check table information
        table_info = get_table_info(engine, table_name)

        if not table_info['exists']:
            print(f"Table '{table_name}' does not exist in the database.")
            result['success'] = True
            return result

        result['table_existed'] = True

        print(f"Table '{table_name}' found:")
        print(f"  - Rows: {table_info['row_count']}")
        print(f"  - Foreign keys: {len(table_info['foreign_keys'])}")
        print(f"  - Referenced by other tables: {len(table_info['referenced_by'])}")

        # Show dependencies
        if table_info['referenced_by']:
            print("\nTables that reference this table:")
            for ref in table_info['referenced_by']:
                print(f"  - {ref['table']} (constraint: {ref['constraint_name']}, columns: {ref['columns']})")
            result['dependencies_found'] = table_info['referenced_by']

        if table_info['foreign_keys']:
            print("\nForeign keys in this table:")
            for fk in table_info['foreign_keys']:
                print(f"  - {fk['name']}: {fk['constrained_columns']} -> {fk['referred_table']}.{fk['referred_columns']}")

        if dry_run:
            print(f"\n[DRY RUN] Would remove table '{table_name}'")
            if create_backup and table_info['row_count'] > 0:
                print(f"[DRY RUN] Would create backup with {table_info['row_count']} rows")

            if table_info['referenced_by']:
                print(f"[DRY RUN] Would first drop {len(table_info['referenced_by'])} foreign key constraints")

            result['success'] = True
            return result

        # Create backup if requested and table has data
        if create_backup and table_info['row_count'] > 0:
            backup_filename = backup_table(session, table_name)
            result['backup_created'] = backup_filename

        # Drop foreign key constraints from other tables first
        for ref in table_info['referenced_by']:
            drop_constraint_sql = f"ALTER TABLE {ref['table']} DROP CONSTRAINT {ref['constraint_name']}"
            print(f"Dropping foreign key constraint: {ref['constraint_name']}")
            session.execute(text(drop_constraint_sql))

        # Drop the table
        drop_table_sql = f"DROP TABLE {table_name} CASCADE"
        print(f"Dropping table: {table_name}")
        session.execute(text(drop_table_sql))

        session.commit()

        print(f"✅ Table '{table_name}' removed successfully!")
        result['success'] = True

    except Exception as e:
        session.rollback()
        error_msg = f"Error removing table '{table_name}': {str(e)}"
        print(f"❌ {error_msg}")
        result['error'] = error_msg
        raise

    return result

def main():
    """Main function."""
    parser = argparse.ArgumentParser(
        description="Remove conversations table from the database"
    )
    parser.add_argument(
        "--env",
        choices=["local", "prod"],
        required=True,
        help="Environment to run migration against (local or prod)"
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Apply the migration (default is dry run)"
    )
    parser.add_argument(
        "--table-name",
        default="conversations",
        help="Name of the table to remove (default: conversations)"
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Skip creating backup (not recommended)"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force removal even if there are dependencies (use with caution)"
    )

    args = parser.parse_args()

    # Safety check for production
    if args.env == "prod" and args.apply:
        if not args.force:
            confirm = input("⚠️  You are about to remove a table from PRODUCTION. Type 'CONFIRM' to proceed: ")
            if confirm != 'CONFIRM':
                print("Operation cancelled.")
                sys.exit(0)

    try:
        # Load environment configuration
        print(f"Loading configuration for {args.env} environment...")
        config = load_environment_config(args.env)

        # Create database connection
        print("Connecting to database...")
        engine, SessionLocal = create_database_connection(config)

        # Test connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Database connection successful!")

        # Create session and run migration
        session = SessionLocal()

        try:
            print(f"\nAnalyzing table '{args.table_name}'...")
            result = remove_conversations_table(
                session=session,
                table_name=args.table_name,
                create_backup=not args.no_backup,
                dry_run=not args.apply
            )

            # Print results
            if result['success']:
                if not args.apply:
                    print("\n✅ Analysis completed successfully!")
                    print("Run with --apply to execute the removal.")
                    if result['dependencies_found']:
                        print("⚠️  Dependencies found. Review them carefully before proceeding.")
                else:
                    print("\n✅ Table removal completed successfully!")
                    if result['backup_created']:
                        print(f"📁 Backup created: {result['backup_created']}")
            else:
                print("❌ Operation failed. Check the output above.")
                sys.exit(1)

        finally:
            session.close()

    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()