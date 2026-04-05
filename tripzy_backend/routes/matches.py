from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Match, TravelProfile, User
from auth import get_current_user

router = APIRouter()

class MatchRequest(BaseModel):
    user2Id: str

@router.get("")
def get_matches(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    my_profile = db.query(TravelProfile).filter(TravelProfile.userId == userId).first()
    if not my_profile:
        return []

    candidates = db.query(TravelProfile).filter(
        TravelProfile.preferredDestination == my_profile.preferredDestination,
        TravelProfile.userId != userId
    ).all()

    results = []
    for c in candidates:
        score = 50
        if c.budgetRange == my_profile.budgetRange: score += 20
        if c.travelStyle == my_profile.travelStyle: score += 20

        user = db.query(User).filter(User.userId == c.userId).first()

        existing_match = db.query(Match).filter(
            ((Match.user1Id == userId) & (Match.user2Id == c.userId)) |
            ((Match.user1Id == c.userId) & (Match.user2Id == userId))
        ).first()

        results.append({
            "userId": c.userId,
            "fullName": user.fullName if user else "Traveler",
            "matchScore": score,
            "preferredDestination": c.preferredDestination,
            "travelStyle": c.travelStyle,
            "budgetRange": c.budgetRange,
            "interests": c.interests,
            "matchId": existing_match.matchId if existing_match else None,
        })

    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results

@router.post("", status_code=201)
def create_match(data: MatchRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]

    existing = db.query(Match).filter(
        ((Match.user1Id == userId) & (Match.user2Id == data.user2Id)) |
        ((Match.user1Id == data.user2Id) & (Match.user2Id == userId))
    ).first()

    if existing:
        return {"message": "Already matched", "matchId": existing.matchId}

    match = Match(user1Id=userId, user2Id=data.user2Id, matchScore=75, matchStatus="accepted")
    db.add(match)
    db.commit()
    db.refresh(match)
    return {"message": "Match confirmed", "matchId": match.matchId}