from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import User
from auth import get_current_user

router = APIRouter()

class UpdateUserRequest(BaseModel):
    fullName:     Optional[str] = None
    phoneNumber:  Optional[str] = None
    bio:          Optional[str] = None
    profilePhoto: Optional[str] = None
    gender:       Optional[str] = None

# ── GET USER ──────────────────────────────────────────────────
@router.get("/{userId}")
def get_user(userId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.userId == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "userId":       user.userId,
        "fullName":     user.fullName,
        "email":        user.email,
        "phoneNumber":  user.phoneNumber,
        "bio":          user.bio,
        "profilePhoto": user.profilePhoto,
        "gender":       user.gender,
        "accountStatus":user.accountStatus,
        "createdAt":    user.createdAt,
    }

# ── UPDATE USER ───────────────────────────────────────────────
@router.put("/{userId}")
def update_user(userId: str, data: UpdateUserRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.userId == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.fullName:     user.fullName     = data.fullName
    if data.phoneNumber:  user.phoneNumber  = data.phoneNumber
    if data.bio:          user.bio          = data.bio
    if data.profilePhoto: user.profilePhoto = data.profilePhoto
    if data.gender:       user.gender       = data.gender

    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully"}

# ── DELETE USER ───────────────────────────────────────────────
@router.delete("/{userId}")
def delete_user(userId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.userId == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "Account deleted"}
