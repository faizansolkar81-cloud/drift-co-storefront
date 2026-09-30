# =============================================================
# Drift & Co. — Database Configuration
# Sets up the SQLAlchemy engine, session factory, and Base
# class for all ORM models. Reads credentials from .env.
# =============================================================
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from .env file
load_dotenv()

DB_ENGINE = os.getenv("DB_ENGINE", "sqlite").lower()
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    database_url = make_url(DATABASE_URL)
    if database_url.get_backend_name() not in {"postgres", "postgresql"}:
        raise ValueError("DATABASE_URL must use PostgreSQL")
    if database_url.drivername in {"postgres", "postgresql"}:
        database_url = database_url.set(drivername="postgresql+psycopg")
    DATABASE_URL = database_url.render_as_string(hide_password=False)
    DB_ENGINE = "postgresql"
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
elif DB_ENGINE == "sqlite":
    DB_PATH = os.getenv("DB_PATH", os.path.join(os.path.dirname(__file__), "drift_and_co.db"))
    DATABASE_URL = f"sqlite:///{DB_PATH}"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True,
    )
elif DB_ENGINE == "mysql":
    # Read database settings from environment
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_NAME = os.getenv("DB_NAME", "drift_and_co")

    # Build the MySQL connection URL
    # Format: mysql+pymysql://user:password@host:port/database
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    # Create the SQLAlchemy engine
    # pool_pre_ping checks connections before using them (avoids stale connection errors)
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    raise ValueError(f"Unsupported DB_ENGINE: {DB_ENGINE}")

# Session factory — each request gets its own session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that all models inherit from
Base = declarative_base()


def init_database():
    """
    Create the database if needed, then create all tables.
    Falls back to SQLite when that engine is selected.
    """
    if DB_ENGINE in {"sqlite", "postgresql"}:
        Base.metadata.create_all(bind=engine)
        return

    # Connect to MySQL server (without specifying a database)
    # to create the database if it doesn't exist
    server_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/"
    server_engine = create_engine(server_url)
    with server_engine.connect() as conn:
        # Create database if it doesn't exist
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
        conn.commit()
    server_engine.dispose()

    # Now create all tables inside the database
    Base.metadata.create_all(bind=engine)


def get_db():
    """
    FastAPI dependency that provides a database session to each
    request. The session is automatically closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
