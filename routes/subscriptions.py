from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Subscription
from auth import get_current_user

router = APIRouter()

class SubscriptionRequest(BaseModel):
    planName:  str
    price:     float
    duration:  Optional[str] = "Monthly"

@router.get("/{userId}")
def get_subscription(userId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    sub = db.query(Subscription).filter(Subscription.userId == userId).first()
    if not sub:
        raise HTTPException(status_code=404, detail="No subscription found")
    return sub

@router.post("", status_code=201)
def create_subscription(data: SubscriptionRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    existing = db.query(Subscription).filter(Subscription.userId == userId, Subscription.subscriptionStatus == "Active").first()
    if existing:
        raise HTTPException(status_code=409, detail="Already subscribed")
    sub = Subscription(userId=userId, **data.dict())
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return {"message": "Subscription activated", "subscriptionId": sub.subscriptionId}

@router.put("/{subId}")
def upgrade_subscription(subId: str, planName: str, price: float, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    sub = db.query(Subscription).filter(Subscription.subscriptionId == subId).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    sub.planName = planName
    sub.price = price
    db.commit()
    return {"message": "Plan upgraded"}

@router.delete("/{subId}")
def cancel_subscription(subId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    sub = db.query(Subscription).filter(Subscription.subscriptionId == subId).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    sub.subscriptionStatus = "Cancelled"
    db.commit()
    return {"message": "Subscription cancelled"}
