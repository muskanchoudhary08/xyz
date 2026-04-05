from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
from models import User
from auth import hash_password, verify_password, create_access_token

router = APIRouter()

# ── SCHEMAS ───────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    fullName: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# ── REGISTER ──────────────────────────────────────────────────
@router.post("/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user with hashed password
    new_user = User(
        fullName=data.fullName,
        email=data.email,
        passwordHash=hash_password(data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"userId": new_user.userId, "message": "Account created successfully"}

# ── LOGIN ─────────────────────────────────────────────────────
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Check password
    if not verify_password(data.password, user.passwordHash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Generate JWT token
    token = create_access_token({"sub": user.userId, "email": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "userId": user.userId,
        "fullName": user.fullName
    }
