from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Payment
from auth import get_current_user
import uuid

router = APIRouter()

class PaymentRequest(BaseModel):
    subscriptionId: str
    amount:         float
    paymentMethod:  Optional[str] = "Credit Card"

@router.get("")
def get_payments(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    return db.query(Payment).filter(Payment.userId == userId).all()

@router.post("", status_code=201)
def create_payment(data: PaymentRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    userId = current_user["sub"]
    payment = Payment(
        userId=userId,
        subscriptionId=data.subscriptionId,
        amount=data.amount,
        paymentMethod=data.paymentMethod,
        transactionReference=f"TXN_{uuid.uuid4().hex[:12].upper()}"
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return {"message": "Payment successful", "paymentId": payment.paymentId}
