from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Trip
from auth import get_current_user

router = APIRouter()

class TripRequest(BaseModel):
    destination: str
    startDate:   Optional[str] = None
    endDate:     Optional[str] = None
    budget:      Optional[float] = None
    tripType:    Optional[str] = None
    description: Optional[str] = None

# ── GET ALL TRIPS FOR USER ────────────────────────────────────
@router.get("")
def get_trips(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    trips = db.query(Trip).filter(Trip.userId == userId).all()
    return trips

# ── CREATE TRIP ───────────────────────────────────────────────
@router.post("", status_code=201)
def create_trip(data: TripRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    trip = Trip(userId=userId, **data.dict())
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return {"message": "Trip created", "tripId": trip.tripId}

# ── UPDATE TRIP STATUS ────────────────────────────────────────
@router.patch("/{tripId}")
def update_trip(tripId: str, status: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.tripId == tripId).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    trip.status = status
    db.commit()
    return {"message": "Trip status updated"}

# ── DELETE TRIP ───────────────────────────────────────────────
@router.delete("/{tripId}")
def delete_trip(tripId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.tripId == tripId).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted"}
