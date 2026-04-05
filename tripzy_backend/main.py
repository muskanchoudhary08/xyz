from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import quiz

from routes import auth, users, profiles, trips, matches, messages, subscriptions, payments, bookings, reviews, notifications

print("Checking quiz router...")
try:
    from routes import quiz
    print("Quiz router imported successfully")
except Exception as e:
    print(f"Error importing quiz: {e}")

app = FastAPI(
    title="Tripzy API",
    description="Backend API for Tripzy - Personality-Based Travel Companion Platform",
    version="1.0.0"
)

# ── CORS — allows React frontend to talk to this backend ─────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ROUTES ────────────────────────────────────────────────────
app.include_router(auth.router,          prefix="/auth",          tags=["Auth"])
app.include_router(users.router,         prefix="/users",         tags=["Users"])
app.include_router(profiles.router,      prefix="/profile",       tags=["Travel Profile"])
app.include_router(trips.router,         prefix="/trips",         tags=["Trips"])
app.include_router(matches.router,       prefix="/matches",       tags=["Matches"])
app.include_router(messages.router,      prefix="/messages",      tags=["Messages"])
app.include_router(subscriptions.router, prefix="/subscriptions", tags=["Subscriptions"])
app.include_router(payments.router,      prefix="/payments",      tags=["Payments"])
app.include_router(bookings.router,      prefix="/bookings",      tags=["Bookings"])
app.include_router(reviews.router,       prefix="/reviews",       tags=["Reviews"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])

@app.get("/")
def root():
    return {"message": "Welcome to Tripzy API", "status": "running"}
