from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict
from database import get_db
from models import QuizQuestion, UserQuizResponse
from auth import get_current_user

router = APIRouter()

class QuizSubmitRequest(BaseModel):
    responses: Dict[str, str]  # {question_id: selected_option}

# ── GET ALL QUIZ QUESTIONS ────────────────────────────────────
@router.get("/questions")
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(QuizQuestion).all()
    return [
        {
            "id": q.id,
            "question_text": q.question_text,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d
        }
        for q in questions
    ]

# ── SUBMIT QUIZ ANSWERS ───────────────────────────────────────
@router.post("/submit")
def submit_quiz(data: QuizSubmitRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    
    for question_id, answer in data.responses.items():
        # Check if user already answered this question
        existing = db.query(UserQuizResponse).filter(
            UserQuizResponse.user_id == user_id,
            UserQuizResponse.question_id == int(question_id)
        ).first()
        
        if existing:
            # Update existing answer
            existing.selected_option = answer
        else:
            # Create new answer
            response = UserQuizResponse(
                user_id=user_id,
                question_id=int(question_id),
                selected_option=answer
            )
            db.add(response)
    
    db.commit()
    return {"message": "Quiz submitted successfully"}

# ── GET USER'S QUIZ RESPONSES ─────────────────────────────────
@router.get("/my-responses")
def get_my_responses(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    responses = db.query(UserQuizResponse).filter(
        UserQuizResponse.user_id == user_id
    ).all()
    
    return [
        {
            "question_id": r.question_id,
            "selected_option": r.selected_option
        }
        for r in responses
    ]