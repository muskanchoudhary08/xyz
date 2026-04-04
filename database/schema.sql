-- 1. USERS TABLE
CREATE TABLE users (
    "userId" SERIAL PRIMARY KEY,
    "fullName" VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(20),
    "dateOfBirth" DATE,
    gender VARCHAR(20),
    "profilePhoto" TEXT,
    bio TEXT,
    "accountStatus" VARCHAR(20) DEFAULT 'active',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TRAVELPROFILE TABLE
CREATE TABLE travelprofile (
    "profileId" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE REFERENCES users("userId") ON DELETE CASCADE,
    "preferredDestination" TEXT,
    "budgetRange" VARCHAR(50),
    "travelStyle" VARCHAR(50),
    "accommodationType" VARCHAR(50),
    "foodPreference" VARCHAR(50),
    "languagePreference" VARCHAR(50),
    interests TEXT,
    "availabilityStart" DATE,
    "availabilityEnd" DATE
);

-- 3. TRIP TABLE
CREATE TABLE trip (
    "tripId" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    destination VARCHAR(100) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    budget DECIMAL(10,2),
    "tripType" VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'planned',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MATCH TABLE
CREATE TABLE match (
    "matchId" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    "user2Id" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    "matchScore" DECIMAL(5,2),
    "matchedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "matchStatus" VARCHAR(20) DEFAULT 'pending'
);

-- 5. MESSAGE TABLE
CREATE TABLE message (
    "messageId" SERIAL PRIMARY KEY,
    "senderId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    "receiverId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    "matchId" INTEGER REFERENCES match("matchId") ON DELETE CASCADE,
    "messageText" TEXT NOT NULL,
    "sentAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "readStatus" BOOLEAN DEFAULT FALSE
);

-- 6. SUBSCRIPTION TABLE
CREATE TABLE subscription (
    "subscriptionId" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE REFERENCES users("userId") ON DELETE CASCADE,
    "planName" VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER,
    "startDate" DATE,
    "endDate" DATE,
    "subscriptionStatus" VARCHAR(20) DEFAULT 'active'
);

-- 7. PAYMENT TABLE
CREATE TABLE payment (
    "paymentId" SERIAL PRIMARY KEY,
    "subscriptionId" INTEGER REFERENCES subscription("subscriptionId") ON DELETE SET NULL,
    "userId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    "paymentMethod" VARCHAR(50),
    "paymentDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "paymentStatus" VARCHAR(20) DEFAULT 'pending',
    "transactionReference" VARCHAR(100) UNIQUE
);

-- 8. REVIEW TABLE
CREATE TABLE review (
    "reviewId" SERIAL PRIMARY KEY,
    "reviewerId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    "reviewedUserId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    "reviewDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. NOTIFICATION TABLE
CREATE TABLE notification (
    "notificationId" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    title VARCHAR(100),
    message TEXT,
    type VARCHAR(50),
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. BOOKING TABLE
CREATE TABLE booking (
    "bookingId" SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users("userId") ON DELETE CASCADE,
    "tripId" INTEGER REFERENCES trip("tripId") ON DELETE CASCADE,
    "bookingDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "bookingStatus" VARCHAR(20) DEFAULT 'confirmed',
    "numberOfPeople" INTEGER DEFAULT 1,
    "totalCost" DECIMAL(10,2)
);