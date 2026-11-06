#!/usr/bin/env python3
"""
Database Migration Script with Backup and Cleanup ** should update for prod **
Adds Subscription Fields to Users Table and removes conversations table
"""

import sys
import os
from pathlib import Path
import datetime
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# Add the parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

# Import SQLAlchemy components
from sqlalchemy import create_engine, text, exc
from sqlalchemy.engine.url import URL

def get_engine():
    """Create database engine using environment variables"""
    # Database configuration from your .env.local
    db_config = {
        'drivername': 'postgresql',
        'username': os.getenv('POSTGRES_USER', 'postgres'),
        'password': os.getenv('POSTGRES_PASSWORD', 'changeme'),
        'host': os.getenv('POSTGRES_SERVER', 'localhost'),
        'port': os.getenv('POSTGRES_PORT', '5432'),
        'database': os.getenv('POSTGRES_DB', 'BMO')
    }

    # Create database URL
    db_url = URL.create(**db_config)
    logger.info(f"Connecting to database: {db_url.render_as_string(hide_password=False)}")

    # Create engine
    return create_engine(db_url)

def create_backup_table(conn, backup_name):
    """Create a backup of the users table"""
    try:
        # Check if backup table already exists
        check_backup = text(f"SELECT to_regclass('{backup_name}')")
        result = conn.execute(check_backup).scalar()

        if result:
            logger.info(f"⏭️ Backup table {backup_name} already exists")
            return True

        # Create backup table
        create_backup = text(f"CREATE TABLE {backup_name} AS SELECT * FROM users")
        conn.execute(create_backup)
        logger.info(f"✅ Backup created: {backup_name}")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to create backup: {e}")
        return False

def drop_conversations_table(conn):
    """Drop the conversations table if it exists"""
    try:
        # Check if conversations table exists
        check_table = text("SELECT to_regclass('conversations')")
        result = conn.execute(check_table).scalar()

        if result:
            # First, drop any foreign key constraints that might reference conversations
            # (You might need to adjust this based on your actual schema)
            try:
                conn.execute(text("ALTER TABLE IF EXISTS other_table DROP CONSTRAINT IF EXISTS conversations_fkey"))
            except:
                pass  # Ignore errors if the constraint doesn't exist

            # Drop the conversations table
            conn.execute(text("DROP TABLE conversations CASCADE"))
            logger.info("✅ Dropped conversations table")
            return True
        else:
            logger.info("⏭️ conversations table does not exist")
            return True
    except Exception as e:
        logger.error(f"❌ Failed to drop conversations table: {e}")
        return False

def restore_from_backup(conn, backup_name):
    """Restore users table from backup in case of migration failure"""
    try:
        # Drop current users table
        conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))

        # Restore from backup
        restore_sql = text(f"CREATE TABLE users AS SELECT * FROM {backup_name}")
        conn.execute(restore_sql)

        # Rename backup table to avoid conflicts
        rename_backup = text(f"ALTER TABLE {backup_name} RENAME TO {backup_name}_restored")
        conn.execute(rename_backup)

        logger.info(f"✅ Successfully restored from backup: {backup_name}")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to restore from backup: {e}")
        return False

def run_migration():
    """Add subscription columns to users table with backup and cleanup"""

    # Generate timestamp for backup table name
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"users_backup_{timestamp}"

    logger.info("🚀 Starting migration: Adding subscription fields to users table...")
    logger.info(f"🛡️ Creating backup: {backup_name}")
    logger.info("🗑️  Dropping conversations table if it exists")

    try:
        # Create engine with local database configuration
        engine = get_engine()

        with engine.connect() as conn:
            # Start transaction
            trans = conn.begin()

            try:
                # Create backup first
                if not create_backup_table(conn, backup_name):
                    raise Exception("Backup creation failed")

                # Drop conversations table
                if not drop_conversations_table(conn):
                    logger.warning("⚠️  Could not drop conversations table, but continuing with migration")

                # Add subscription_tier column
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR DEFAULT 'free' NOT NULL"))
                    logger.info("✅ Added subscription_tier")
                except exc.ProgrammingError as e:
                    if "already exists" in str(e):
                        logger.info("⏭️ subscription_tier already exists")
                    else:
                        raise

                # Add subscription_status column
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR DEFAULT 'active' NOT NULL"))
                    logger.info("✅ Added subscription_status")
                except exc.ProgrammingError as e:
                    if "already exists" in str(e):
                        logger.info("⏭️ subscription_status already exists")
                    else:
                        raise

                # Add monthly_ai_credits_used column
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_ai_credits_used INTEGER DEFAULT 0 NOT NULL"))
                    logger.info("✅ Added monthly_ai_credits_used")
                except exc.ProgrammingError as e:
                    if "already exists" in str(e):
                        logger.info("⏭️ monthly_ai_credits_used already exists")
                    else:
                        raise

                # Add monthly_job_searches_used column
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_job_searches_used INTEGER DEFAULT 0 NOT NULL"))
                    logger.info("✅ Added monthly_job_searches_used")
                except exc.ProgrammingError as e:
                    if "already exists" in str(e):
                        logger.info("⏭️ monthly_job_searches_used already exists")
                    else:
                        raise

                # Add last_reset_date column
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reset_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL"))
                    logger.info("✅ Added last_reset_date")
                except exc.ProgrammingError as e:
                    if "already exists" in str(e):
                        logger.info("⏭️ last_reset_date already exists")
                    else:
                        raise

                # Commit transaction
                trans.commit()

                logger.info("\n🎉 Migration completed successfully!")
                logger.info("=" * 60)
                logger.info(f"✅ Your data is safe - backup available: {backup_name}")
                logger.info("✅ All subscription columns added to users table")
                logger.info("✅ Removed conversations table (if it existed)")
                return True

            except Exception as e:
                # Rollback transaction on error
                trans.rollback()
                logger.error(f"❌ Migration failed during execution: {e}")

                # Try to restore from backup
                logger.info("🛡️ Attempting to restore from backup...")
                if restore_from_backup(conn, backup_name):
                    logger.info("✅ Successfully restored from backup")
                else:
                    logger.error("❌ Failed to restore from backup")
                    logger.info(f"💡 You can try to manually restore using: CREATE TABLE users AS SELECT * FROM {backup_name}")

                return False

    except Exception as e:
        logger.error(f"❌ Migration failed to start: {e}")
        return False


if __name__ == "__main__":
    # Load environment variables if running directly
    try:
        from dotenv import load_dotenv
        env_path = Path(__file__).parent.parent / '.env.local'
        load_dotenv(dotenv_path=env_path)
    except ImportError:
        logger.warning("python-dotenv not installed, relying on existing environment variables")

    success = run_migration()
    sys.exit(0 if success else 1)