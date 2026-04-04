# Tripzy Backend — FastAPI

## Setup (do this once)

### Step 1 — Open terminal in this folder

### Step 2 — Create a virtual environment
```
python -m venv venv
```

### Step 3 — Activate it
Windows:
```
venv\Scripts\activate
```
Mac:
```
source venv/bin/activate
```

### Step 4 — Install dependencies
```
pip install -r requirements.txt
```

### Step 5 — Set up PostgreSQL
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Open pgAdmin or psql
3. Create a database called `tripzy`
4. Open `database.py` and update this line with your password:
```
DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/tripzy"
```

### Step 6 — Create the tables
```
python -c "from database import Base, engine; from models import *; Base.metadata.create_all(bind=engine)"
```

### Step 7 — Run the server
```
uvicorn main:app --reload
```

Server runs at: http://localhost:8000

---

## Test the API

Open your browser and go to:
```
http://localhost:8000/docs
```
This opens the automatic API documentation where you can test every endpoint!

---

## Project Structure

```
tripzy_backend/
├── main.py            ← App entry point, all routes registered here
├── database.py        ← PostgreSQL connection
├── models.py          ← All 10 database tables
├── auth.py            ← JWT tokens + password hashing
├── requirements.txt   ← All dependencies
└── routes/
    ├── auth.py        ← POST /auth/register, POST /auth/login
    ├── users.py       ← GET/PUT/DELETE /users/{userId}
    ├── profiles.py    ← GET/POST/PUT /profile
    ├── trips.py       ← GET/POST/PATCH/DELETE /trips
    ├── matches.py     ← GET/POST/PATCH /matches
    ├── messages.py    ← GET/POST/PATCH /messages
    ├── subscriptions.py
    ├── payments.py
    ├── bookings.py
    ├── reviews.py
    └── notifications.py
```

---

## All Endpoints

| Method | Endpoint | What it does |
|--------|---------|-------------|
| POST | /auth/register | Create account |
| POST | /auth/login | Login, returns JWT token |
| GET | /users/{userId} | Get user profile |
| PUT | /users/{userId} | Update profile |
| DELETE | /users/{userId} | Delete account |
| GET | /profile/{userId} | Get travel preferences |
| POST | /profile | Create travel profile |
| PUT | /profile/{profileId} | Update preferences |
| GET | /trips | Get all my trips |
| POST | /trips | Create a trip |
| PATCH | /trips/{tripId} | Update trip status |
| DELETE | /trips/{tripId} | Delete trip |
| GET | /matches | Find compatible travelers |
| POST | /matches | Connect with someone |
| PATCH | /matches/{matchId} | Update match status |
| GET | /messages/{matchId} | Get conversation |
| POST | /messages | Send a message |
| PATCH | /messages/{messageId}/read | Mark as read |
| GET | /subscriptions/{userId} | Get subscription |
| POST | /subscriptions | Subscribe to plan |
| PUT | /subscriptions/{subId} | Upgrade plan |
| DELETE | /subscriptions/{subId} | Cancel subscription |
| GET | /payments | Get payment history |
| POST | /payments | Make a payment |
| GET | /bookings | Get my bookings |
| POST | /bookings | Create booking |
| PATCH | /bookings/{bookingId} | Cancel booking |
| GET | /reviews/{userId} | Get reviews |
| POST | /reviews | Submit review |
| GET | /notifications | Get notifications |
| PATCH | /notifications/{id}/read | Mark as read |
| DELETE | /notifications | Clear all |
