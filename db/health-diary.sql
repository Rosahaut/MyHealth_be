-- Drop the database if it exists and then create it
DROP DATABASE IF EXISTS MyHealth;
CREATE DATABASE MyHealth;

USE MyHealth;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_level VARCHAR(10) DEFAULT 'regular'
);

CREATE TABLE DiaryEntries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_date DATE NOT NULL,
    mood VARCHAR(50),
    weight DECIMAL(5,2),
    sleep_hours INT,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Medications (
    medication_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    medication_date DATE NOT NULL,
    name VARCHAR(30) NOT NULL,
    dosage VARCHAR(10) NOT NULL,
    taken_at TIME NOT NULL,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Exercises (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_date DATE NOT NULL,
    type VARCHAR(15) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    intensity ENUM('Low', 'Medium', 'High') NOT NULL,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Measurements (
    measurement_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    metric_date DATE NOT NULL,
    heart_rate INT,
    blood_pressure VARCHAR(20),
    blood_sugar DECIMAL(5,1),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Insert sample data

-- Inserting sample data into the Users table
INSERT INTO Users (username, password, email, user_level)
VALUES
    ('tupu', 'hashed_password', 'tupu@email.com', 'regular'),
    ('hupu', 'hashed_password', 'hupu@email.com', 'admin'),
    ('lupu', 'hashed_password', 'lupu@email.com', 'regular');

-- Inserting sample data into the DiaryEntries table
INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes)
VALUES
    (1, '2025-03-04', 'Happy', 72.5, 8, 'Feeling great today!'),
    (2, '2025-03-04', 'Stressed', 68.0, 6, 'Busy day at work, need to relax.'),
    (3, '2025-03-03', 'Neutral', 75.0, 7, 'Just another regular day.');

-- Inserting sample data into the Medications table
INSERT INTO Medications (user_id, medication_date, name, dosage, taken_at, notes)
VALUES
    (1, '2025-03-04', 'Aspirin', '100mg', '08:00:00', 'For headache'),
    (2, '2025-03-04', 'Ibuprofen', '200mg', '10:30:00', 'Pain relief after workout'),
    (3, '2025-03-03', 'Metformin', '500mg', '09:00:00', 'For diabetes management');

-- Inserting sample data into the Exercises table
INSERT INTO Exercises (user_id, exercise_date, type, start_time, end_time, intensity, notes)
VALUES
    (1, '2025-03-04', 'Jogging', '06:30:00', '07:00:00', 'Medium', 'Morning jog for 30 minutes'),
    (2, '2025-03-04', 'Yoga', '18:00:00', '19:00:00', 'Low', 'Relaxing yoga session after work'),
    (3, '2025-03-03', 'Weightlifting', '14:00:00', '15:00:00', 'High', 'Heavy lifting session');

-- Inserting sample data into the Measurements table
INSERT INTO Measurements (user_id, metric_date, heart_rate, blood_pressure, blood_sugar, notes)
VALUES
    (1, '2025-03-04', 72, '120/80', 5.5, 'Feeling good after exercise'),
    (2, '2025-03-04', 85, '130/85', 12.0, 'Need to monitor blood sugar levels'),
    (3, '2025-03-03', 78, '125/82', 4.5, 'Routine check-up');
