-- Create Users table
CREATE TABLE Users (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_num VARCHAR(12)
);

-- Create Movies table
CREATE TABLE Movies (
    movieID INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    genre VARCHAR(100),
    duration INT NOT NULL,
    rating VARCHAR(10)
);

-- Create Theaters table
CREATE TABLE Theaters (
    theaterID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL
);

-- Create Cinemas table
CREATE TABLE Cinemas (
    cinemaID INT PRIMARY KEY AUTO_INCREMENT,
    theaterID INT,
    cinema_num INT NOT NULL,
    capacity INT NOT NULL,
    FOREIGN KEY (theaterID) REFERENCES Theaters(theaterID) ON DELETE CASCADE
);

-- Create Showtimes table
CREATE TABLE Showtimes (
    showtimeID INT PRIMARY KEY AUTO_INCREMENT,
    movieID INT,
    cinemaID INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    FOREIGN KEY (movieID) REFERENCES Movies(movieID) ON DELETE CASCADE,
    FOREIGN KEY (cinemaID) REFERENCES Cinemas(cinemaID) ON DELETE CASCADE
);

-- Create Seating table
CREATE TABLE Seating (
    seatID INT PRIMARY KEY AUTO_INCREMENT,
    cinemaID INT,
    seat_num VARCHAR(10) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cinemaID) REFERENCES Cinemas(cinemaID) ON DELETE CASCADE
);

-- Create Tickets table
CREATE TABLE Tickets (
    ticketID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    showtimeID INT,
    seatID INT,
    booking_time DATETIME NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (showtimeID) REFERENCES Showtimes(showtimeID) ON DELETE CASCADE,
    FOREIGN KEY (seatID) REFERENCES Seating(seatID) ON DELETE CASCADE
);

-- Create Payments table
CREATE TABLE Payments (
    paymentID INT PRIMARY KEY AUTO_INCREMENT,
    ticketID INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_time DATETIME NOT NULL,
    FOREIGN KEY (ticketID) REFERENCES Tickets(ticketID) ON DELETE CASCADE
);

-- Insert sample data into Users
INSERT INTO Users (name, email, password, phone_num) VALUES
('John Doe', 'john.doe@email.com', 'hashedpassword1', '1234567890'),
('Jane Smith', 'jane.smith@email.com', 'hashedpassword2', '0987654321'),
('Alice Brown', 'alice.brown@email.com', 'hashedpassword3', '5555555555');

-- Insert sample data into Movies
INSERT INTO Movies (title, genre, duration, rating) VALUES
('The Sci-Fi Adventure', 'Sci-Fi', 120, 'PG-13'),
('Romantic Getaway', 'Romance', 105, 'R'),
('Action Packed', 'Action', 130, 'PG');

-- Insert sample data into Theaters
INSERT INTO Theaters (name, location) VALUES
('City Cinema', '123 Main St, City A'),
('Downtown Theater', '456 Elm St, City B');

-- Insert sample data into Cinemas
INSERT INTO Cinemas (theaterID, cinema_num, capacity) VALUES
(1, 1, 50),
(1, 2, 40),
(2, 1, 60);

-- Insert sample data into Showtimes
INSERT INTO Showtimes (movieID, cinemaID, start_time, end_time) VALUES
(1, 1, '2025-05-13 18:00:00', '2025-05-13 20:00:00'),
(2, 2, '2025-05-13 19:00:00', '2025-05-13 20:45:00'),
(3, 3, '2025-05-13 20:00:00', '2025-05-13 22:10:00');

-- Insert sample data into Seating
INSERT INTO Seating (cinemaID, seat_num, is_available) VALUES
(1, 'A1', TRUE),
(1, 'A2', TRUE),
(2, 'B1', TRUE),
(2, 'B2', FALSE),
(3, 'C1', TRUE);

-- Insert sample data into Tickets
INSERT INTO Tickets (userID, showtimeID, seatID, booking_time) VALUES
(1, 1, 1, '2025-05-12 10:00:00'),
(2, 2, 3, '2025-05-12 11:00:00'),
(3, 3, 5, '2025-05-12 12:00:00');

-- Insert sample data into Payments
INSERT INTO Payments (ticketID, amount, payment_method, payment_time) VALUES
(1, 15.50, 'Credit Card', '2025-05-12 10:05:00'),
(2, 12.00, 'Debit Card', '2025-05-12 11:05:00'),
(3, 18.75, 'PayPal', '2025-05-12 12:05:00');