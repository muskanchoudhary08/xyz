from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Booking, Trip
from auth import get_current_user

router = APIRouter()

class BookingRequest(BaseModel):
    tripId:         str
    numberOfPeople: Optional[int] = 1
    totalCost:      Optional[float] = None

@router.get("")
def get_bookings(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    return db.query(Booking).filter(Booking.userId == userId).all()

@router.post("", status_code=201)
def create_booking(data: BookingRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    trip = db.query(Trip).filter(Trip.tripId == data.tripId).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    booking = Booking(userId=userId, **data.dict())
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"message": "Booking confirmed", "bookingId": booking.bookingId}

@router.patch("/{bookingId}")
def cancel_booking(bookingId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    booking = db.query(Booking).filter(Booking.bookingId == bookingId).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.bookingStatus = "Cancelled"
    db.commit()
    return {"message": "Booking cancelled"}
