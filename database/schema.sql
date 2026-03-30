--databse folder
-- ============================================
-- TRIPZY DATABASE SCHEMA
-- Personality-Based Travel Companion Platform
-- ============================================

-- ============================================
-- 1. USER TABLE
-- Stores all user account information
-- ============================================
CREATE TABLE users (
    UserId SERIAL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20),
    DateOfBirth DATE,
    Gender VARCHAR(20),
    ProfilePhoto TEXT,
    Bio TEXT,
    AccountStatus VARCHAR(20) DEFAULT 'active',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. TRAVELPROFILE TABLE
-- Stores user travel preferences and style
-- ============================================
CREATE TABLE travelprofile (
    ProfileId SERIAL PRIMARY KEY,
    UserId INT UNIQUE REFERENCES users(UserId) ON DELETE CASCADE,
    PreferredDestination TEXT,
    BudgetRange VARCHAR(50),
    TravelStyle VARCHAR(50),
    AccommodationType VARCHAR(50),
    FoodPreference VARCHAR(50),
    LanguagePreference VARCHAR(50),
    Interests TEXT,
    AvailabilityStart DATE,
    AvailabilityEnd DATE
);

-- ============================================
-- 3. TRIP TABLE
-- Stores trips created by users
-- ============================================
CREATE TABLE trip (
    TripId SERIAL PRIMARY KEY,
    UserId INT REFERENCES users(UserId) ON DELETE CASCADE,
    Destination VARCHAR(100) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Budget DECIMAL(10,2),
    TripType VARCHAR(50),
    Description TEXT,
    Status VARCHAR(20) DEFAULT 'planned',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. MATCH TABLE
-- Stores matches between users
-- ============================================
CREATE TABLE match (
    MatchId SERIAL PRIMARY KEY,
    UserId INT REFERENCES users(UserId) ON DELETE CASCADE,
    User2Id INT REFERENCES users(UserId) ON DELETE CASCADE,
    MatchScore DECIMAL(5,2),
    MatchedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MatchStatus VARCHAR(20) DEFAULT 'pending',
    CHECK (UserId != User2Id)
);

-- ============================================
-- 5. MESSAGE TABLE
-- Stores messages between matched users
-- ============================================
CREATE TABLE message (
    MessageId SERIAL PRIMARY KEY,
    SenderId INT REFERENCES users(UserId) ON DELETE CASCADE,
    ReceiverId INT REFERENCES users(UserId) ON DELETE CASCADE,
    MatchId INT REFERENCES match(MatchId) ON DELETE CASCADE,
    MessageText TEXT NOT NULL,
    SentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ReadStatus BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 6. SUBSCRIPTION TABLE
-- Stores user subscription plans
-- ============================================
CREATE TABLE subscription (
    SubscriptionId SERIAL PRIMARY KEY,
    UserId INT UNIQUE REFERENCES users(UserId) ON DELETE CASCADE,
    PlanName VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Duration INT,
    StartDate DATE,
    EndDate DATE,
    SubscriptionStatus VARCHAR(20) DEFAULT 'active'
);

-- ============================================
-- 7. PAYMENT TABLE
-- Stores payment transactions
-- ============================================
CREATE TABLE payment (
    PaymentId SERIAL PRIMARY KEY,
    SubscriptionId INT REFERENCES subscription(SubscriptionId) ON DELETE SET NULL,
    UserId INT REFERENCES users(UserId) ON DELETE CASCADE,
    Amount DECIMAL(10,2) NOT NULL,
    PaymentMethod VARCHAR(50),
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PaymentStatus VARCHAR(20) DEFAULT 'pending',
    TransactionReference VARCHAR(100) UNIQUE
);

-- ============================================
-- 8. REVIEW TABLE
-- Stores user ratings and feedback after trips
-- ============================================
CREATE TABLE review (
    ReviewId SERIAL PRIMARY KEY,
    ReviewerId INT REFERENCES users(UserId) ON DELETE CASCADE,
    ReviewedUserId INT REFERENCES users(UserId) ON DELETE CASCADE,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT,
    ReviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (ReviewerId != ReviewedUserId)
);

-- ============================================
-- 9. NOTIFICATION TABLE
-- Stores user notifications
-- ============================================
CREATE TABLE notification (
    NotificationId SERIAL PRIMARY KEY,
    UserId INT REFERENCES users(UserId) ON DELETE CASCADE,
    Title VARCHAR(100),
    Message TEXT,
    Type VARCHAR(50),
    IsRead BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. BOOKING TABLE (Phase 3)
-- Stores trip bookings
-- ============================================
CREATE TABLE booking (
    BookingId SERIAL PRIMARY KEY,
    UserId INT REFERENCES users(UserId) ON DELETE CASCADE,
    TripId INT REFERENCES trip(TripId) ON DELETE CASCADE,
    BookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    BookingStatus VARCHAR(20) DEFAULT 'confirmed',
    NumberOfPeople INT DEFAULT 1,
    TotalCost DECIMAL(10,2)
);

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Insert sample users
INSERT INTO users (FullName, Email, PasswordHash, PhoneNumber, DateOfBirth, Gender, Bio) VALUES
('John Doe', 'john@example.com', 'hashed_password_1', '+1234567890', '1995-05-15', 'Male', 'Love hiking and adventure!'),
('Jane Smith', 'jane@example.com', 'hashed_password_2', '+1987654321', '1998-08-22', 'Female', 'Beach lover, foodie, and photographer'),
('Mike Johnson', 'mike@example.com', 'hashed_password_3', '+1122334455', '1992-11-10', 'Male', 'Backpacker, budget traveler');

-- Insert sample travel profiles
INSERT INTO travelprofile (UserId, PreferredDestination, BudgetRange, TravelStyle, AccommodationType, Interests) VALUES
(1, 'Mountains, National Parks', '1000-2000', 'Adventure', 'Hostel', 'Hiking, Camping, Photography'),
(2, 'Beaches, Europe', '2000-3000', 'Relaxed', 'Hotel', 'Food, Shopping, Sightseeing'),
(3, 'Asia, South America', '500-1000', 'Backpacker', 'Hostel', 'Culture, History, Local Food');

-- Insert sample trips
INSERT INTO trip (UserId, Destination, StartDate, EndDate, Budget, TripType, Description) VALUES
(1, 'Banff National Park', '2026-06-01', '2026-06-07', 1500.00, 'Adventure', 'Hiking and camping in the Rockies'),
(2, 'Bali, Indonesia', '2026-07-10', '2026-07-20', 2500.00, 'Relaxation', 'Beach vacation and cultural tour'),
(3, 'Thailand', '2026-08-05', '2026-08-20', 1200.00, 'Backpacking', 'Explore temples, beaches, and local markets');

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(Email);
CREATE INDEX idx_users_accountstatus ON users(AccountStatus);

-- Trip table indexes
CREATE INDEX idx_trip_userid ON trip(UserId);
CREATE INDEX idx_trip_dates ON trip(StartDate, EndDate);
CREATE INDEX idx_trip_destination ON trip(Destination);

-- Match table indexes
CREATE INDEX idx_match_userid ON match(UserId);
CREATE INDEX idx_match_user2id ON match(User2Id);
CREATE INDEX idx_match_status ON match(MatchStatus);

-- Message table indexes
CREATE INDEX idx_message_matchid ON message(MatchId);
CREATE INDEX idx_message_sender ON message(SenderId);
CREATE INDEX idx_message_receiver ON message(ReceiverId);
CREATE INDEX idx_message_readstatus ON message(ReadStatus);

-- Payment table indexes
CREATE INDEX idx_payment_userid ON payment(UserId);
CREATE INDEX idx_payment_status ON payment(PaymentStatus);

-- Review table indexes
CREATE INDEX idx_review_reviewer ON review(ReviewerId);
CREATE INDEX idx_review_reviewed ON review(ReviewedUserId);

-- Notification table indexes
CREATE INDEX idx_notification_userid ON notification(UserId);
CREATE INDEX idx_notification_isread ON notification(IsRead);

-- Booking table indexes
CREATE INDEX idx_booking_userid ON booking(UserId);
CREATE INDEX idx_booking_tripid ON booking(TripId);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: User Profile with Travel Preferences
CREATE VIEW user_full_profile AS
SELECT 
    u.UserId,
    u.FullName,
    u.Email,
    u.PhoneNumber,
    u.DateOfBirth,
    u.Bio,
    u.AccountStatus,
    tp.PreferredDestination,
    tp.BudgetRange,
    tp.TravelStyle,
    tp.Interests
FROM users u
LEFT JOIN travelprofile tp ON u.UserId = tp.UserId;

-- View: Active Trips with User Info
CREATE VIEW active_trips AS
SELECT 
    t.TripId,
    t.Destination,
    t.StartDate,
    t.EndDate,
    t.Budget,
    t.TripType,
    t.Status,
    u.FullName AS CreatedBy,
    u.Email AS ContactEmail
FROM trip t
JOIN users u ON t.UserId = u.UserId
WHERE t.Status = 'planned';

-- View: Successful Matches
CREATE VIEW successful_matches AS
SELECT 
    m.MatchId,
    u1.FullName AS User1,
    u2.FullName AS User2,
    m.MatchScore,
    m.MatchedOn,
    m.MatchStatus
FROM match m
JOIN users u1 ON m.UserId = u1.UserId
JOIN users u2 ON m.User2Id = u2.UserId
WHERE m.MatchStatus = 'accepted';
