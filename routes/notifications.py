from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Notification
from auth import get_current_user

router = APIRouter()

@router.get("")
def get_notifications(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    return db.query(Notification).filter(Notification.userId == userId).order_by(Notification.createdAt.desc()).all()

@router.patch("/{notifId}/read")
def mark_read(notifId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    notif = db.query(Notification).filter(Notification.notificationId == notifId).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.isRead = True
    db.commit()
    return {"message": "Marked as read"}

@router.delete("")
def clear_all(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    db.query(Notification).filter(Notification.userId == userId).delete()
    db.commit()
    return {"message": "All notifications cleared"}
