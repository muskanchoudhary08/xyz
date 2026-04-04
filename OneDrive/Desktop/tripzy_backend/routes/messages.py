from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Message, Match
from auth import get_current_user

router = APIRouter()

class MessageRequest(BaseModel):
    matchId:     str
    receiverId:  str
    messageText: str

# ── GET CONVERSATION ──────────────────────────────────────────
@router.get("/{matchId}")
def get_messages(matchId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    messages = db.query(Message).filter(Message.matchId == matchId).order_by(Message.sentAt).all()
    return messages

# ── SEND MESSAGE ──────────────────────────────────────────────
@router.post("", status_code=201)
def send_message(data: MessageRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]

    # Verify the users are matched
    match = db.query(Match).filter(Match.matchId == data.matchId).first()
    if not match:
        raise HTTPException(status_code=403, detail="Cannot message — not matched")

    message = Message(
        senderId=userId,
        receiverId=data.receiverId,
        matchId=data.matchId,
        messageText=data.messageText
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return {"message": "Message sent", "messageId": message.messageId}

# ── MARK AS READ ──────────────────────────────────────────────
@router.patch("/{messageId}/read")
def mark_read(messageId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    message = db.query(Message).filter(Message.messageId == messageId).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    message.readStatus = True
    db.commit()
    return {"message": "Marked as read"}
