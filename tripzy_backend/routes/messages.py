from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Message, Match, User
from auth import get_current_user

router = APIRouter()

class MessageRequest(BaseModel):
    matchId:     str
    receiverId:  str
    messageText: str

@router.get("/{matchId}")
def get_messages(matchId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    messages = db.query(Message).filter(Message.matchId == matchId).order_by(Message.sentAt).all()
    result = []
    for msg in messages:
        sender = db.query(User).filter(User.userId == msg.senderId).first()
        result.append({
            "messageId": msg.messageId,
            "messageText": msg.messageText,
            "senderId": msg.senderId,
            "senderName": sender.fullName if sender else "Unknown",
            "receiverId": msg.receiverId,
            "matchId": msg.matchId,
            "readStatus": msg.readStatus,
            "sentAt": msg.sentAt
        })
    return result

@router.post("", status_code=201)
def send_message(data: MessageRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]

    match = db.query(Match).filter(Match.matchId == data.matchId).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    if match.user1Id != userId and match.user2Id != userId:
        raise HTTPException(status_code=403, detail="You are not part of this match")

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

@router.patch("/{messageId}/read")
def mark_read(messageId: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    message = db.query(Message).filter(Message.messageId == messageId).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    message.readStatus = True
    db.commit()
    return {"message": "Marked as read"}