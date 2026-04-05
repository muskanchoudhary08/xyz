from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ── DATABASE URL ──────────────────────────────────────────────
# Format: postgresql://username:2004@host:port/database_name
# Change these to match your PostgreSQL setup
DATABASE_URL = "postgresql://postgres:2004@localhost:5432/tripzy"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ── Dependency — use this in every route ──────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
