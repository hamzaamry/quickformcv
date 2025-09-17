#!/usr/bin/env python3
"""
Migration script to add 'hidden' field with default value 'false'
to all items in resume sections.

This script handles both local and production environments.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
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

def add_hidden_field_to_items(section_data: Dict[str, Any]) -> Dict[str, Any]:
    """Add 'hidden' field with default value 'false' to all items in section_data."""
    if not isinstance(section_data, dict):
        return section_data

    # Create a copy to avoid modifying the original
    updated_section_data = section_data.copy()

    # Check if the section has items
    if 'items' in updated_section_data and isinstance(updated_section_data['items'], list):
        updated_items = []

        for item in updated_section_data['items']:
            if isinstance(item, dict):
                # Add 'hidden' field if it doesn't exist
                if 'hidden' not in item:
                    item['hidden'] = False
                updated_items.append(item)
            else:
                # If item is not a dict, keep it as is
                updated_items.append(item)

        updated_section_data['items'] = updated_items

    return updated_section_data

def migrate_resume_sections(session, dry_run: bool = True) -> Dict[str, int]:
    """
    Migrate resume sections to add 'hidden' field to all items.

    Args:
        session: Database session
        dry_run: If True, only show what would be changed without applying changes

    Returns:
        Dictionary with migration statistics
    """
    stats = {
        'sections_processed': 0,
        'sections_updated': 0,
        'items_updated': 0,
        'errors': 0
    }

    try:
        # Query all resume sections
        result = session.execute(
            text("SELECT id, resume_id, section_type, section_data FROM resume_sections")
        )

        sections = result.fetchall()
        print(f"Found {len(sections)} resume sections to process")

        for section in sections:
            stats['sections_processed'] += 1
            section_id = section[0]
            resume_id = section[1]
            section_type = section[2]
            section_data = section[3]

            try:
                # Parse the JSONB data
                if isinstance(section_data, str):
                    parsed_data = json.loads(section_data)
                else:
                    parsed_data = section_data

                # Check if section has items and needs updating
                needs_update = False
                items_count = 0

                if ('items' in parsed_data and
                        isinstance(parsed_data['items'], list) and
                        len(parsed_data['items']) > 0):

                    for item in parsed_data['items']:
                        if isinstance(item, dict):
                            items_count += 1
                            if 'hidden' not in item:
                                needs_update = True

                if needs_update:
                    updated_data = add_hidden_field_to_items(parsed_data)
                    stats['sections_updated'] += 1
                    stats['items_updated'] += items_count

                    if dry_run:
                        print(f"[DRY RUN] Would update section {section_id} "
                              f"(resume: {resume_id}, type: {section_type}) "
                              f"- {items_count} items would get 'hidden': false")
                    else:
                        # Update the section in database
                        update_query = text(
                            "UPDATE resume_sections SET section_data = :section_data "
                            "WHERE id = :section_id"
                        )
                        session.execute(update_query, {
                            'section_data': json.dumps(updated_data),
                            'section_id': section_id
                        })

                        print(f"Updated section {section_id} "
                              f"(resume: {resume_id}, type: {section_type}) "
                              f"- {items_count} items updated")
                else:
                    if items_count > 0:
                        print(f"Section {section_id} "
                              f"(resume: {resume_id}, type: {section_type}) "
                              f"already has 'hidden' field for all {items_count} items")
                    else:
                        print(f"Section {section_id} "
                              f"(resume: {resume_id}, type: {section_type}) "
                              f"has no items to update")

            except Exception as e:
                stats['errors'] += 1
                print(f"Error processing section {section_id}: {str(e)}")
                continue

        if not dry_run:
            session.commit()
            print("Migration completed successfully!")
        else:
            print("Dry run completed. Use --apply to execute the migration.")

    except Exception as e:
        if not dry_run:
            session.rollback()
        print(f"Migration failed: {str(e)}")
        stats['errors'] += 1
        raise

    return stats

def main():
    """Main migration function."""
    parser = argparse.ArgumentParser(
        description="Migrate resume sections to add 'hidden' field to items"
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
        "--verbose",
        action="store_true",
        help="Enable verbose output"
    )

    args = parser.parse_args()

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
            print(f"\nStarting migration (dry_run={not args.apply})...")
            stats = migrate_resume_sections(session, dry_run=not args.apply)

            # Print statistics
            print(f"\nMigration Statistics:")
            print(f"- Sections processed: {stats['sections_processed']}")
            print(f"- Sections updated: {stats['sections_updated']}")
            print(f"- Items updated: {stats['items_updated']}")
            print(f"- Errors: {stats['errors']}")

            if stats['errors'] == 0:
                if args.apply:
                    print("✅ Migration completed successfully!")
                else:
                    print("✅ Dry run completed successfully!")
                    print("Run with --apply to execute the migration.")
            else:
                print("⚠️  Migration completed with errors. Check the output above.")
                sys.exit(1)

        finally:
            session.close()

    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()