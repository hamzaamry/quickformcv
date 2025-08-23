import os
import time
from functools import lru_cache

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker

from ..models import Base
from ..utils.logging_config import logger
from .constants import DatabaseConstants

load_dotenv()


class DatabaseConfig:
    @classmethod
    @lru_cache(maxsize=1)
    def get_database_url(cls):
        return (
            f"postgresql://"
            f"{os.getenv('POSTGRES_USER')}:"
            f"{os.getenv('POSTGRES_PASSWORD')}@"
            f"{os.getenv('POSTGRES_SERVER')}:"
            f"{os.getenv('POSTGRES_PORT')}/"
            f"{os.getenv('POSTGRES_DB')}"
        )

    @classmethod
    def create_engine(cls):
        return create_engine(
            cls.get_database_url(),
            pool_pre_ping=True,
            pool_size=DatabaseConstants.POOL_SIZE,
            max_overflow=DatabaseConstants.MAX_OVERFLOW,
            echo=DatabaseConstants.ECHO_SQL,
        )

    @classmethod
    def check_tables_exist(cls, engine):
        """Check which tables exist in the database"""
        inspector = inspect(engine)
        existing_tables = set(inspector.get_table_names())
        missing_tables = DatabaseConstants.REQUIRED_TABLES - existing_tables
        return existing_tables, missing_tables

    @classmethod
    def _acquire_init_lock(cls, engine, timeout=30):
        """Acquire a database lock for initialization"""
        try:
            with engine.connect() as conn:
                # Use PostgreSQL advisory lock
                result = conn.execute(text("SELECT pg_try_advisory_lock(123456789)")).scalar()
                if result:
                    logger.info("Acquired database initialization lock")
                    return True
                else:
                    logger.info("Another process is initializing database, waiting...")
                    # Wait and check if tables are created by other process
                    for i in range(timeout):
                        time.sleep(1)
                        existing_tables, missing_tables = cls.check_tables_exist(engine)
                        if not missing_tables:
                            logger.info("Database initialization completed by another process")
                            return False
                    logger.warning("Timeout waiting for database initialization")
                    return False
        except Exception as e:
            logger.error(f"Error acquiring initialization lock: {e}")
            return False

    @classmethod
    def _release_init_lock(cls, engine):
        """Release the database initialization lock"""
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT pg_advisory_unlock(123456789)"))
                logger.info("Released database initialization lock")
        except Exception as e:
            logger.error(f"Error releasing initialization lock: {e}")

    @classmethod
    def create_tables(cls, engine):
        """Create tables only if they don't exist, with proper locking"""
        try:
            # First check if tables already exist
            existing_tables, missing_tables = cls.check_tables_exist(engine)

            if not missing_tables:
                logger.info("All required tables already exist!")
                return

            # Try to acquire lock for initialization
            if not cls._acquire_init_lock(engine):
                # Either failed to get lock or tables were created by another process
                return

            try:
                # Double-check tables after acquiring lock
                existing_tables, missing_tables = cls.check_tables_exist(engine)

                if not missing_tables:
                    logger.info("All required tables already exist (verified after lock)!")
                    return

                logger.info("Creating missing database tables:")
                for table in missing_tables:
                    logger.info(f"  - {table}")

                Base.metadata.create_all(bind=engine)

                # Verify tables were created
                final_tables, remaining_missing = cls.check_tables_exist(engine)
                if not remaining_missing:
                    logger.info("All tables were created successfully!")
                else:
                    logger.error(f"Failed to create some tables: {remaining_missing}")

            finally:
                cls._release_init_lock(engine)

        except SQLAlchemyError as e:
            logger.error(f"Error managing database tables: {e}")
            raise

    @classmethod
    def drop_all_tables(cls, engine):
        """Drop all tables in the database"""
        try:
            # Get list of existing tables before dropping
            existing_tables, _ = cls.check_tables_exist(engine)

            if not existing_tables:
                logger.info("No tables exist in the database.")
                return True

            logger.warning(f"Preparing to drop {len(existing_tables)} tables:")
            for table in existing_tables:
                logger.warning(f"  - {table}")

            # Drop all tables
            Base.metadata.drop_all(bind=engine)

            # Verify tables were dropped
            remaining_tables, _ = cls.check_tables_exist(engine)
            if not remaining_tables:
                logger.info("All tables were dropped successfully!")
                return True
            else:
                logger.error(f"Some tables remain after drop attempt: {remaining_tables}")
                return False

        except SQLAlchemyError as e:
            logger.error(f"Error dropping database tables: {e}")
            raise


engine = DatabaseConfig.create_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def verify_database_connection():
    """Verify database connection and table existence"""
    try:
        with engine.connect():
            logger.info("Connected to the database successfully!")
            DatabaseConfig.create_tables(engine)
            return True
    except SQLAlchemyError as e:
        logger.error(f"Database Connection Failed: {e}")
        return False


def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def reset_database():
    """Reset the database by dropping all tables and recreating them"""
    try:
        logger.warning("Starting database reset process...")

        # Drop all existing tables
        DatabaseConfig.drop_all_tables(engine)

        # Recreate all tables
        DatabaseConfig.create_tables(engine)

        logger.info("Database reset completed successfully!")
        return True
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        return False