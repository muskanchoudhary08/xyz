from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Match, TravelProfile, User
from auth import get_current_user

router = APIRouter()

class MatchRequest(BaseModel):
    user2Id: str

# ── GET ALL MATCHES ───────────────────────────────────────────
@router.get("")
def get_matches(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]

    # Get current user's travel profile
    my_profile = db.query(TravelProfile).filter(TravelProfile.userId == userId).first()
    if not my_profile:
        raise HTTPException(status_code=404, detail="Complete your travel profile first")

    # Find users with same destination
    candidates = db.query(TravelProfile).filter(
        TravelProfile.preferredDestination == my_profile.preferredDestination,
        TravelProfile.userId != userId
    ).all()

    # Build match cards with basic score
    results = []
    for c in candidates:
        score = 50  # base score
        if c.budgetRange == my_profile.budgetRange:     score += 20
        if c.travelStyle == my_profile.travelStyle:     score += 20
        if c.accommodationType == my_profile.accommodationType: score += 10

        user = db.query(User).filter(User.userId == c.userId).first()
        results.append({
            "userId":      c.userId,
            "fullName":    user.fullName if user else "Unknown",
            "profilePhoto":user.profilePhoto if user else None,
            "matchScore":  score,
            "destination": c.preferredDestination,
            "travelStyle": c.travelStyle,
            "budgetRange": c.budgetRange,
            "interests":   c.interests,
        })

    # Sort by score
    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results

# ── CONNECT WITH SOMEONE ──────────────────────────────────────
@router.post("", status_code=201)
def create_match(data: MatchRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]

    # Check if already matched
    existing = db.query(Match).filter(
        ((Match.user1Id == userId) & (Match.user2Id == data.user2Id)) |
        ((Match.user1Id == data.user2Id) & (Match.user2Id == userId))
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Already matched with this user")

    match = Match(user1Id=userId, user2Id=data.user2Id, matchScore=75)
    db.add(match)
    db.commit()
    db.refresh(match)
    return {"message": "Match confirmed", "matchId": match.matchId}

# ── UPDATE MATCH STATUS ───────────────────────────────────────
@router.patch("/{matchId}")
def update_match(matchId: str, matchStatus: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    match = db.query(Match).filter(Match.matchId == matchId).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    match.matchStatus = matchStatus
    db.commit()
    return {"message": "Match status updated"}
