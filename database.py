from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ── DATABASE URL ──────────────────────────────────────────────
# Format: postgresql://username:password@host:port/database_name
# Change these to match your PostgreSQL setup
DATABASE_URL = "postgresql://neondb_owner:npg_1QMnHaDqFC6l@ep-shiny-salad-akqtz297-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


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
