from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Review, Match
from auth import get_current_user

router = APIRouter()

class ReviewRequest(BaseModel):
    reviewedUserId: str
    rating:         int
    comment:        Optional[str] = None

@router.get("/{userId}")
def get_reviews(userId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    reviews = db.query(Review).filter(Review.reviewedUserId == userId).all()
    avg = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
    return {"reviews": reviews, "averageRating": round(avg, 1), "totalReviews": len(reviews)}

@router.post("", status_code=201)
def submit_review(data: ReviewRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]

    # Check already reviewed
    existing = db.query(Review).filter(
        Review.reviewerId == userId,
        Review.reviewedUserId == data.reviewedUserId
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Already reviewed this user")

    review = Review(reviewerId=userId, **data.dict())
    db.add(review)
    db.commit()
    db.refresh(review)
    return {"message": "Review submitted", "reviewId": review.reviewId}
