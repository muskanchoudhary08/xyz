from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import TravelProfile
from auth import get_current_user

router = APIRouter()

class ProfileRequest(BaseModel):
    preferredDestination: Optional[str] = None
    budgetRange:          Optional[str] = None
    travelStyle:          Optional[str] = None
    accommodationType:    Optional[str] = None
    foodPreference:       Optional[str] = None
    languagePreference:   Optional[str] = None
    interests:            Optional[str] = None
    availabilityStart:    Optional[str] = None
    availabilityEnd:      Optional[str] = None

# ── GET PROFILE ───────────────────────────────────────────────
@router.get("/{userId}")
def get_profile(userId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    profile = db.query(TravelProfile).filter(TravelProfile.userId == userId).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Travel profile not found")
    return profile

# ── CREATE PROFILE ────────────────────────────────────────────
@router.post("", status_code=201)
def create_profile(data: ProfileRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    existing = db.query(TravelProfile).filter(TravelProfile.userId == userId).first()
    if existing:
        raise HTTPException(status_code=409, detail="Travel profile already exists")

    # Convert empty strings to None for date fields
    profile_data = data.dict()
    if profile_data.get("availabilityStart") == "":
        profile_data["availabilityStart"] = None
    if profile_data.get("availabilityEnd") == "":
        profile_data["availabilityEnd"] = None

    profile = TravelProfile(userId=userId, **profile_data)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return {"message": "Travel profile created", "profileId": profile.profileId}

# ── UPDATE PROFILE ────────────────────────────────────────────
@router.put("/{profileId}")
def update_profile(profileId: str, data: ProfileRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    profile = db.query(TravelProfile).filter(TravelProfile.profileId == profileId).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = data.dict(exclude_none=True)
    # Convert empty strings to None for date fields
    if update_data.get("availabilityStart") == "":
        update_data["availabilityStart"] = None
    if update_data.get("availabilityEnd") == "":
        update_data["availabilityEnd"] = None

    for key, value in update_data.items():
        setattr(profile, key, value)

    db.commit()
    return {"message": "Preferences updated"}