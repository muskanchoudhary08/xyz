from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, Enum, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from database import Base
from datetime import datetime
import uuid

def gen_id():
    return str(uuid.uuid4())

# ── USER ──────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    userId           = Column(String, primary_key=True, default=gen_id)
    fullName         = Column(String, nullable=False)
    email            = Column(String, unique=True, nullable=False)
    passwordHash     = Column(String, nullable=False)
    phoneNumber      = Column(String, nullable=True)
    dateOfBirth      = Column(Date, nullable=True)
    gender           = Column(String, nullable=True)
    profilePhoto     = Column(String, nullable=True)
    bio              = Column(Text, nullable=True)
    accountStatus    = Column(String, default="Active")
    createdAt        = Column(DateTime, default=datetime.utcnow)
    updatedAt        = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    travelProfile    = relationship("TravelProfile", back_populates="user", uselist=False)
    trips            = relationship("Trip", back_populates="user")
    subscription     = relationship("Subscription", back_populates="user", uselist=False)
    notifications    = relationship("Notification", back_populates="user")

# ── TRAVEL PROFILE ────────────────────────────────────────────
class TravelProfile(Base):
    __tablename__ = "travel_profiles"

    profileId              = Column(String, primary_key=True, default=gen_id)
    userId                 = Column(String, ForeignKey("users.userId"), unique=True)
    preferredDestination   = Column(String, nullable=True)
    budgetRange            = Column(String, nullable=True)
    travelStyle            = Column(String, nullable=True)
    accommodationType      = Column(String, nullable=True)
    foodPreference         = Column(String, nullable=True)
    languagePreference     = Column(String, nullable=True)
    interests              = Column(Text, nullable=True)  # stored as comma-separated string
    availabilityStart      = Column(Date, nullable=True)
    availabilityEnd        = Column(Date, nullable=True)

    user = relationship("User", back_populates="travelProfile")

# ── TRIP ──────────────────────────────────────────────────────
class Trip(Base):
    __tablename__ = "trips"

    tripId       = Column(String, primary_key=True, default=gen_id)
    userId       = Column(String, ForeignKey("users.userId"))
    destination  = Column(String, nullable=False)
    startDate    = Column(Date, nullable=True)
    endDate      = Column(Date, nullable=True)
    budget       = Column(Float, nullable=True)
    tripType     = Column(String, nullable=True)
    description  = Column(Text, nullable=True)
    status       = Column(String, default="Upcoming")
    createdAt    = Column(DateTime, default=datetime.utcnow)

    user     = relationship("User", back_populates="trips")
    bookings = relationship("Booking", back_populates="trip")

# ── MATCH ─────────────────────────────────────────────────────
class Match(Base):
    __tablename__ = "matches"

    matchId      = Column(String, primary_key=True, default=gen_id)
    user1Id      = Column(String, ForeignKey("users.userId"))
    user2Id      = Column(String, ForeignKey("users.userId"))
    matchScore   = Column(Float, nullable=True)
    matchedOn    = Column(DateTime, default=datetime.utcnow)
    matchStatus  = Column(String, default="Pending")

    messages = relationship("Message", back_populates="match")

# ── MESSAGE ───────────────────────────────────────────────────
class Message(Base):
    __tablename__ = "messages"

    messageId   = Column(String, primary_key=True, default=gen_id)
    senderId    = Column(String, ForeignKey("users.userId"))
    receiverId  = Column(String, ForeignKey("users.userId"))
    matchId     = Column(String, ForeignKey("matches.matchId"))
    messageText = Column(Text, nullable=False)
    sentAt      = Column(DateTime, default=datetime.utcnow)
    readStatus  = Column(Boolean, default=False)

    match = relationship("Match", back_populates="messages")

# ── SUBSCRIPTION ──────────────────────────────────────────────
class Subscription(Base):
    __tablename__ = "subscriptions"

    subscriptionId     = Column(String, primary_key=True, default=gen_id)
    userId             = Column(String, ForeignKey("users.userId"), unique=True)
    planName           = Column(String, nullable=False)
    price              = Column(Float, nullable=False)
    duration           = Column(String, nullable=True)
    startDate          = Column(Date, nullable=True)
    endDate            = Column(Date, nullable=True)
    subscriptionStatus = Column(String, default="Active")

    user     = relationship("User", back_populates="subscription")
    payments = relationship("Payment", back_populates="subscription")

# ── PAYMENT ───────────────────────────────────────────────────
class Payment(Base):
    __tablename__ = "payments"

    paymentId            = Column(String, primary_key=True, default=gen_id)
    subscriptionId       = Column(String, ForeignKey("subscriptions.subscriptionId"))
    userId               = Column(String, ForeignKey("users.userId"))
    amount               = Column(Float, nullable=False)
    paymentMethod        = Column(String, nullable=True)
    paymentDate          = Column(DateTime, default=datetime.utcnow)
    paymentStatus        = Column(String, default="Completed")
    transactionReference = Column(String, nullable=True)

    subscription = relationship("Subscription", back_populates="payments")

# ── BOOKING ───────────────────────────────────────────────────
class Booking(Base):
    __tablename__ = "bookings"

    bookingId      = Column(String, primary_key=True, default=gen_id)
    userId         = Column(String, ForeignKey("users.userId"))
    tripId         = Column(String, ForeignKey("trips.tripId"))
    bookingDate    = Column(DateTime, default=datetime.utcnow)
    bookingStatus  = Column(String, default="Confirmed")
    numberOfPeople = Column(Integer, nullable=True)
    totalCost      = Column(Float, nullable=True)

    trip = relationship("Trip", back_populates="bookings")

# ── REVIEW ────────────────────────────────────────────────────
class Review(Base):
    __tablename__ = "reviews"

    reviewId       = Column(String, primary_key=True, default=gen_id)
    reviewerId     = Column(String, ForeignKey("users.userId"))
    reviewedUserId = Column(String, ForeignKey("users.userId"))
    rating         = Column(Integer, nullable=False)
    comment        = Column(Text, nullable=True)
    reviewDate     = Column(DateTime, default=datetime.utcnow)

# ── NOTIFICATION ──────────────────────────────────────────────
class Notification(Base):
    __tablename__ = "notifications"

    notificationId = Column(String, primary_key=True, default=gen_id)
    userId         = Column(String, ForeignKey("users.userId"))
    title          = Column(String, nullable=False)
    message        = Column(Text, nullable=False)
    type           = Column(String, nullable=True)
    isRead         = Column(Boolean, default=False)
    createdAt      = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
