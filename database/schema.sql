

CREATE TABLE users (
    "userId"        VARCHAR PRIMARY KEY,
    "fullName"      VARCHAR NOT NULL,
    "email"         VARCHAR UNIQUE NOT NULL,
    "passwordHash"  VARCHAR NOT NULL,
    "phoneNumber"   VARCHAR,
    "dateOfBirth"   DATE,
    "gender"        VARCHAR,
    "profilePhoto"  VARCHAR,
    "bio"           TEXT,
    "accountStatus" VARCHAR DEFAULT 'Active',
    "createdAt"     TIMESTAMP DEFAULT NOW(),
    "updatedAt"     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE travel_profiles (
    "profileId"            VARCHAR PRIMARY KEY,
    "userId"               VARCHAR UNIQUE REFERENCES users("userId"),
    "preferredDestination" VARCHAR,
    "budgetRange"          VARCHAR,
    "travelStyle"          VARCHAR,
    "accommodationType"    VARCHAR,
    "foodPreference"       VARCHAR,
    "languagePreference"   VARCHAR,
    "interests"            TEXT,
    "availabilityStart"    DATE,
    "availabilityEnd"      DATE
);


CREATE TABLE quiz (
    "quizId"        VARCHAR PRIMARY KEY,
    "userId"        VARCHAR REFERENCES users("userId") ON DELETE CASCADE,
    "quizType"      VARCHAR NOT NULL,
    "score"         FLOAT,
    "answers"       JSONB,
    "completedAt"   TIMESTAMP DEFAULT NOW(),
    "isActive"      BOOLEAN DEFAULT TRUE
);

CREATE TABLE trips (
    "tripId"      VARCHAR PRIMARY KEY,
    "userId"      VARCHAR REFERENCES users("userId"),
    "destination" VARCHAR NOT NULL,
    "startDate"   DATE,
    "endDate"     DATE,
    "budget"      FLOAT,
    "tripType"    VARCHAR,
    "description" TEXT,
    "status"      VARCHAR DEFAULT 'Upcoming',
    "createdAt"   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE matches (
    "matchId"     VARCHAR PRIMARY KEY,
    "user1Id"     VARCHAR REFERENCES users("userId"),
    "user2Id"     VARCHAR REFERENCES users("userId"),
    "matchScore"  FLOAT,
    "matchedOn"   TIMESTAMP DEFAULT NOW(),
    "matchStatus" VARCHAR DEFAULT 'Pending'
);

CREATE TABLE messages (
    "messageId"   VARCHAR PRIMARY KEY,
    "senderId"    VARCHAR REFERENCES users("userId"),
    "receiverId"  VARCHAR REFERENCES users("userId"),
    "matchId"     VARCHAR REFERENCES matches("matchId"),
    "messageText" TEXT NOT NULL,
    "sentAt"      TIMESTAMP DEFAULT NOW(),
    "readStatus"  BOOLEAN DEFAULT FALSE
);

CREATE TABLE subscriptions (
    "subscriptionId"     VARCHAR PRIMARY KEY,
    "userId"             VARCHAR UNIQUE REFERENCES users("userId"),
    "planName"           VARCHAR NOT NULL,
    "price"              FLOAT NOT NULL,
    "duration"           VARCHAR,
    "startDate"          DATE,
    "endDate"            DATE,
    "subscriptionStatus" VARCHAR DEFAULT 'Active'
);

CREATE TABLE payments (
    "paymentId"            VARCHAR PRIMARY KEY,
    "subscriptionId"       VARCHAR REFERENCES subscriptions("subscriptionId"),
    "userId"               VARCHAR REFERENCES users("userId"),
    "amount"               FLOAT NOT NULL,
    "paymentMethod"        VARCHAR,
    "paymentDate"          TIMESTAMP DEFAULT NOW(),
    "paymentStatus"        VARCHAR DEFAULT 'Completed',
    "transactionReference" VARCHAR
);

CREATE TABLE bookings (
    "bookingId"      VARCHAR PRIMARY KEY,
    "userId"         VARCHAR REFERENCES users("userId"),
    "tripId"         VARCHAR REFERENCES trips("tripId"),
    "bookingDate"    TIMESTAMP DEFAULT NOW(),
    "bookingStatus"  VARCHAR DEFAULT 'Confirmed',
    "numberOfPeople" INTEGER,
    "totalCost"      FLOAT
);


CREATE TABLE reviews (
    "reviewId"       VARCHAR PRIMARY KEY,
    "reviewerId"     VARCHAR REFERENCES users("userId"),
    "reviewedUserId" VARCHAR REFERENCES users("userId"),
    "quizId"         VARCHAR REFERENCES quiz("quizId") ON DELETE SET NULL,
    "rating"         INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "comment"        TEXT,
    "reviewDate"     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    "notificationId" VARCHAR PRIMARY KEY,
    "userId"         VARCHAR REFERENCES users("userId"),
    "title"          VARCHAR NOT NULL,
    "message"        TEXT NOT NULL,
    "type"           VARCHAR,
    "isRead"         BOOLEAN DEFAULT FALSE,
    "createdAt"      TIMESTAMP DEFAULT NOW()
);
