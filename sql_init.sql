-- Create and use the database
DROP DATABASE IF EXISTS `travel_db`;
CREATE DATABASE `travel_db`;
USE `travel_db`;

-- -----------------------------------------------------
-- Table `Destinations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Destinations` (
  `destinationID` INT NOT NULL AUTO_INCREMENT,
  `DestinationName` VARCHAR(50) NOT NULL,
  `Country` VARCHAR(30) NOT NULL,
  `Description` VARCHAR(255) NULL,
  PRIMARY KEY (`destinationID`));

-- -----------------------------------------------------
-- Table `Seasons`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Seasons` (
  `seasonID` INT NOT NULL AUTO_INCREMENT,
  `seasonName` VARCHAR(20) NOT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `Multiplier` DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  PRIMARY KEY (`seasonID`));

-- -----------------------------------------------------
-- Table `Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Users` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(30) NOT NULL,
  `LastName` VARCHAR(30) NOT NULL,
  `EmailAddress` VARCHAR(50) NOT NULL,
  `PhoneNumber` VARCHAR(20) NULL,
  `PasswordHash` VARCHAR(255) NOT NULL,
  `RegistrationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`));

-- -----------------------------------------------------
-- Table `TourPackage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TourPackage` (
  `packageID` INT NOT NULL AUTO_INCREMENT,
  `PackageName` VARCHAR(50) NOT NULL,
  `BasePrice` DECIMAL(10,2) NOT NULL,
  `DurationDays` INT NOT NULL,
  `seasonID` INT NULL,
  `Description` TEXT NULL,
  PRIMARY KEY (`packageID`));

-- -----------------------------------------------------
-- Table `Booking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Booking` (
  `bookingID` INT NOT NULL AUTO_INCREMENT,
  `userID` INT NOT NULL,
  `packageID` INT NULL,
  `BookingDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `BookingPrice` DECIMAL(10,2) NOT NULL,
  `BookingStatus` ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`bookingID`));

-- -----------------------------------------------------
-- Table `Payments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Payments` (
  `paymentID` INT NOT NULL AUTO_INCREMENT,
  `bookingID` INT NOT NULL,
  `userID` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `paymentDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paymentMethod` ENUM('Credit Card', 'GCash', 'Bank Transfer', 'Scout Regiment Funds') NOT NULL,
  `paymentStatus` ENUM('Pending', 'Confirmed', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending',
  `transactionID` VARCHAR(100) NULL,
  PRIMARY KEY (`paymentID`));

-- -----------------------------------------------------
-- Table `Reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Reviews` (
  `reviewID` INT NOT NULL AUTO_INCREMENT,
  `userID` INT NOT NULL,
  `packageID` INT NULL,
  `hotelID` INT NULL,
  `activityID` INT NULL,
  `bookingID` INT NULL,
  `reviewDate` DATE NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` VARCHAR(500) NULL,
  PRIMARY KEY (`reviewID`));

-- -----------------------------------------------------
-- Table `Hotel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Hotel` (
  `hotelID` INT NOT NULL AUTO_INCREMENT,
  `hotelName` VARCHAR(50) NOT NULL,
  `PhoneNumber` VARCHAR(20) NULL,
  `Location` VARCHAR(100) NOT NULL,
  `destinationID` INT NOT NULL,
  `Description` TEXT NULL,
  `StarRating` DECIMAL(2,1) NULL CHECK (`StarRating` >= 0 AND `StarRating` <= 5),
  PRIMARY KEY (`hotelID`));

-- -----------------------------------------------------
-- Table `HotelBooking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `HotelBooking` (
  `HotelBookingID` INT NOT NULL AUTO_INCREMENT,
  `bookingID` INT NOT NULL,
  `hotelID` INT NOT NULL,
  `checkinDate` DATE NOT NULL,
  `checkoutDate` DATE NOT NULL,
  `numberOfRooms` INT NOT NULL DEFAULT 1,
  `pricePerNight` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`HotelBookingID`),
  CONSTRAINT `chk_checkoutDate` CHECK (`checkoutDate` > `checkinDate`));

-- -----------------------------------------------------
-- Table `Activities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Activities` (
  `activityID` INT NOT NULL AUTO_INCREMENT,
  `activityName` VARCHAR(50) NOT NULL,
  `destinationID` INT NOT NULL,
  `Price` DECIMAL(10,2) NOT NULL,
  `Description` TEXT NULL,
  `DurationHours` DECIMAL(4,1) NULL,
  PRIMARY KEY (`activityID`));

-- -----------------------------------------------------
-- Table `ActivityBooking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ActivityBooking` (
  `activityBookingID` INT NOT NULL AUTO_INCREMENT,
  `bookingID` INT NOT NULL,
  `activityID` INT NOT NULL,
  `Date` DATE NOT NULL,
  `numberOfParticipants` INT NOT NULL DEFAULT 1,
  `totalPrice` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`activityBookingID`));

-- -----------------------------------------------------
-- Table `Transportation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Transportation` (
  `transportID` INT NOT NULL AUTO_INCREMENT,
  `TransportType` ENUM('Flight', 'Bus', 'Train', 'Horse Carriage', 'Steam Ship', 'ODM Gear') NOT NULL,
  `Rate` DECIMAL(10,2) NOT NULL,
  `ServiceProvider` VARCHAR(50) NULL,
  `Capacity` INT NULL,
  PRIMARY KEY (`transportID`));

-- -----------------------------------------------------
-- Table `TransportBooking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TransportBooking` (
  `TransportBookingID` INT NOT NULL AUTO_INCREMENT,
  `transportID` INT NOT NULL,
  `bookingID` INT NOT NULL,
  `departureDate` DATETIME NOT NULL,
  `arrivalDate` DATETIME NOT NULL,
  `departureLocation` VARCHAR(100) NULL,
  `arrivalLocation` VARCHAR(100) NULL,
  `seatsBooked` INT NOT NULL DEFAULT 1,
  `totalPrice` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`TransportBookingID`),
  CONSTRAINT `chk_arrivalDate` CHECK (`arrivalDate` > `departureDate`));

-- -----------------------------------------------------
-- Table `AuditLog` (For Triggers)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AuditLog` (
  `logID` INT NOT NULL AUTO_INCREMENT,
  `tableName` VARCHAR(50) NOT NULL,
  `recordID` INT NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `oldValue` TEXT NULL,
  `newValue` TEXT NULL,
  `changedBy` VARCHAR(50) NULL,
  `changeTimestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`logID`));

-- -----------------------------------------------------
-- Triggers
-- -----------------------------------------------------
DELIMITER //
CREATE TRIGGER `after_payment_confirmed_update_booking`
AFTER INSERT ON `Payments`
FOR EACH ROW
BEGIN
  IF NEW.paymentStatus = 'Confirmed' THEN
    UPDATE `Booking`
    SET `BookingStatus` = 'Confirmed'
    WHERE `bookingID` = NEW.bookingID AND `BookingStatus` = 'Pending';
  END IF;
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER `log_booking_cancellation`
AFTER UPDATE ON `Booking`
FOR EACH ROW
BEGIN
  IF OLD.BookingStatus != 'Cancelled' AND NEW.BookingStatus = 'Cancelled' THEN
    INSERT INTO `AuditLog` (`tableName`, `recordID`, `action`, `oldValue`, `newValue`, `changedBy`)
    VALUES ('Booking', NEW.bookingID, 'Status Changed to Cancelled', OLD.BookingStatus, NEW.BookingStatus, CURRENT_USER());
  END IF;
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER `prevent_price_update_on_confirmed_booking`
BEFORE UPDATE ON `Booking`
FOR EACH ROW
BEGIN
    IF OLD.BookingStatus IN ('Confirmed', 'Completed') AND NEW.BookingPrice != OLD.BookingPrice THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot change price of a confirmed or completed booking.';
    END IF;
END; //
DELIMITER ;

-- -----------------------------------------------------
-- Sample Data (Attack on Titan Themed)
-- -----------------------------------------------------
-- Destinations
INSERT INTO `Destinations` (`DestinationName`, `Country`, `Description`) VALUES
('Paradis Island', 'Eldia', 'The island of devils, surrounded by massive walls.'),
('Marley', 'Marley', 'A powerful nation across the sea, oppressor of Eldians.'),
('Shiganshina District', 'Paradis Island', 'Eren Yeager\'s hometown, breached by Titans.'),
('Stohess District', 'Paradis Island', 'An inner district within Wall Sina.'),
('Trost District', 'Paradis Island', 'A district on the southern edge of Wall Rose.'),
('Mitras', 'Paradis Island', 'The royal capital within Wall Sina, home to the King.'),
('Liberio', 'Marley', 'The internment zone for Eldians in Marley.'),
('Hizuru', 'Hizuru', 'An allied nation with advanced technology and culture.'),
('Wall Maria', 'Paradis Island', 'The outermost wall, lost to Titans.'),
('Ragako Village', 'Paradis Island', 'A small village with a dark history of Titan experiments.');

-- Seasons
INSERT INTO `Seasons` (`seasonName`, `startDate`, `endDate`, `Multiplier`) VALUES
('Titan Season', '2025-04-01', '2025-09-30', 1.50),
('Recon Mission Time', '2025-10-01', '2025-12-31', 1.20),
('Off-Season Calm', '2026-01-01', '2026-03-31', 0.90),
('Wall Reconstruction', '2026-04-01', '2026-06-30', 1.30),
('Marleyan Festival', '2026-07-01', '2026-09-30', 1.40);

-- Users (Original 5 + 15 New)
INSERT INTO `Users` (`FirstName`, `LastName`, `EmailAddress`, `PhoneNumber`, `PasswordHash`) VALUES
('Eren', 'Yeager', 'eren.yeager@surveycorps.com', '123-456-001', 'hashed_password_eren'),
('Mikasa', 'Ackerman', 'mikasa.ackerman@surveycorps.com', '123-456-002', 'hashed_password_mikasa'),
('Armin', 'Arlert', 'armin.arlert@surveycorps.com', '123-456-003', 'hashed_password_armin'),
('Levi', 'Ackerman', 'levi.ackerman@surveycorps.com', '123-456-004', 'hashed_password_levi'),
('Hange', 'Zoe', 'hange.zoe@surveycorps.com', '123-456-005', 'hashed_password_hange'),
('Jean', 'Kirstein', 'jean.kirstein@surveycorps.com', '123-456-006', 'hashed_password_jean'),
('Connie', 'Springer', 'connie.springer@surveycorps.com', '123-456-007', 'hashed_password_connie'),
('Sasha', 'Blouse', 'sasha.blouse@surveycorps.com', '123-456-008', 'hashed_password_sasha'),
('Historia', 'Reiss', 'historia.reiss@royal.gov', '123-456-009', 'hashed_password_historia'),
('Reiner', 'Braun', 'reiner.braun@marley.mil', '123-456-010', 'hashed_password_reiner'),
('Annie', 'Leonhart', 'annie.leonhart@marley.mil', '123-456-011', 'hashed_password_annie'),
('Bertholdt', 'Hoover', 'bertholdt.hoover@marley.mil', '123-456-012', 'hashed_password_bertholdt'),
('Zeke', 'Yeager', 'zeke.yeager@marley.mil', '123-456-013', 'hashed_password_zeke'),
('Pieck', 'Finger', 'pieck.finger@marley.mil', '123-456-014', 'hashed_password_pieck'),
('Porco', 'Galliard', 'porco.galliard@marley.mil', '123-456-015', 'hashed_password_porco'),
('Falco', 'Grice', 'falco.grice@marley.mil', '123-456-016', 'hashed_password_falco'),
('Gabi', 'Braun', 'gabi.braun@marley.mil', '123-456-017', 'hashed_password_gabi'),
('Ymir', 'Fritz', 'ymir.fritz@surveycorps.com', '123-456-018', 'hashed_password_ymir'),
('Erwin', 'Smith', 'erwin.smith@surveycorps.com', '123-456-019', 'hashed_password_erwin'),
('Floch', 'Forster', 'floch.forster@yeagerists.com', '123-456-020', 'hashed_password_floch');

-- TourPackage
INSERT INTO `TourPackage` (`PackageName`, `BasePrice`, `DurationDays`, `seasonID`, `Description`) VALUES
('Reclaim Shiganshina Expedition', 1500.00, 7, 1, 'Join the Survey Corps to retake Shiganshina! High risk, high reward.'),
('Inside Wall Sina Cultural Tour', 800.00, 3, 3, 'Experience the life of nobles and the Military Police Brigade within the innermost Wall.'),
('Marleyan Reconnaissance Mission', 2500.00, 14, 2, 'A covert operation to gather intelligence on the nation of Marley. For elite soldiers only.'),
('Titan Study Excursion with Hange', 1200.00, 5, 1, 'Capture and study Titans under the guidance of Commander Hange. Expect the unexpected!'),
('Wall Maria Restoration Project', 1800.00, 10, 4, 'Help rebuild Wall Maria with the Garrison Regiment.'),
('Hizuru Cultural Exchange', 2000.00, 12, 5, 'Explore the advanced culture and technology of Hizuru.'),
('Liberio Festival Experience', 1000.00, 4, 5, 'Join the vibrant Marleyan festival in Liberio.'),
('Mitras Royal Palace Tour', 1500.00, 3, 3, 'A luxurious tour of the royal capital, with restricted access.'),
('Ragako Historical Tour', 900.00, 2, 2, 'Uncover the tragic history of Ragako and its Titan experiments.');

-- Hotels
INSERT INTO `Hotel` (`hotelName`, `PhoneNumber`, `Location`, `destinationID`, `Description`, `StarRating`) VALUES
('Survey Corps HQ Bunks', 'N/A', 'Trost District Barracks', 5, 'Basic but secure accommodation within Survey Corps headquarters.', 2.0),
('Stohess District Guesthouse', '555-1234', 'Noble Quarter, Stohess', 4, 'Comfortable lodging for distinguished visitors.', 4.0),
('Marleyan Internment Zone Lodging', 'N/A', 'Liberio Internment Zone, Marley', 2, 'Restricted lodging for Eldian visitors to Marley.', 1.5),
('Shiganshina Survivor Camp', 'N/A', 'Ruins of Shiganshina', 3, 'Temporary shelters for those brave enough to return.', 1.0),
('Mitras Royal Inn', '555-5678', 'Royal District, Mitras', 6, 'Luxury accommodations near the royal palace.', 5.0),
('Liberio Festival Hostel', 'N/A', 'Festival Grounds, Liberio', 7, 'Budget lodging for festival attendees.', 2.5),
('Hizuru Coastal Resort', '555-9012', 'Hizuru Port', 8, 'A scenic resort with ocean views and modern amenities.', 4.5),
('Wall Maria Outpost', 'N/A', 'Wall Maria Border', 9, 'Rugged lodging for restoration workers.', 1.5),
('Ragako Village Inn', '555-3456', 'Ragako Village Center', 10, 'A quaint inn with a somber history.', 3.0);

-- Activities
INSERT INTO `Activities` (`activityName`, `destinationID`, `Price`, `Description`, `DurationHours`) VALUES
('ODM Gear Training', 1, 150.00, 'Learn to use Omni-Directional Mobility Gear with experienced instructors.', 4.0),
('Titan Slaying Practice (Simulated)', 5, 200.00, 'Hone your titan-slaying skills against realistic dummies in Trost.', 3.0),
('Wall Rose Patrol Duty', 5, 50.00, 'Experience a day in the life of a Garrison Regiment soldier.', 8.0),
('Historical Archives Visit - Stohess', 4, 75.00, 'Explore the royal archives and uncover secrets of the Walls (if you can get access).', 3.0),
('Underground City Tour', 4, 100.00, 'A guided tour of the mysterious Underground city beneath the capital.', 2.5),
('Marleyan Military Parade', 7, 80.00, 'Witness the grandeur of Marley’s military in Liberio.', 2.0),
('Hizuru Tea Ceremony', 8, 120.00, 'Participate in a traditional Hizuru tea ceremony.', 1.5),
('Wall Maria Titan Ruins Tour', 9, 90.00, 'Explore the remnants of Titan battles in Wall Maria.', 4.0),
('Ragako Titan Experiment Exhibit', 10, 60.00, 'Learn about the horrific Titan experiments in Ragako.', 2.0),
('Mitras Royal Garden Stroll', 6, 100.00, 'A guided walk through the exclusive royal gardens.', 2.0);

-- Transportation (Fixed: Valid ENUM values)
INSERT INTO `Transportation` (`TransportType`, `Rate`, `ServiceProvider`, `Capacity`) VALUES
('Horse Carriage', 50.00, 'Local Stables Co.', 4),
('Steam Ship', 300.00, 'Paradis Coastal Liners', 150),
('ODM Gear', 100.00, 'Survey Corps Quartermaster', 1),
('Train', 75.00, 'Garrison Regiment Logistics', 200),
('Flight', 500.00, 'Hizuru Air Services', 100),
('Bus', 60.00, 'Marleyan Transport Co.', 50),
('Horse Carriage', 45.00, 'Ragako Village Stables', 6);

-- Original Bookings
INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(1, 1, 2250.00, 'Pending'); -- Eren, Shiganshina Expedition

SET @erenBookingID = LAST_INSERT_ID();

INSERT INTO `HotelBooking` (`bookingID`, `hotelID`, `checkinDate`, `checkoutDate`, `numberOfRooms`, `pricePerNight`) VALUES
(@erenBookingID, 4, '2025-05-20', '2025-05-27', 1, 50.00);

INSERT INTO `ActivityBooking` (`bookingID`, `activityID`, `Date`, `numberOfParticipants`, `totalPrice`) VALUES
(@erenBookingID, 2, '2025-05-22', 1, 200.00);

INSERT INTO `TransportBooking` (`transportID`, `bookingID`, `departureDate`, `arrivalDate`, `departureLocation`, `arrivalLocation`, `seatsBooked`, `totalPrice`) VALUES
(1, @erenBookingID, '2025-05-20 08:00:00', '2025-05-20 18:00:00', 'Trost District', 'Shiganshina Outskirts', 1, 50.00);

INSERT INTO `Payments` (`bookingID`, `userID`, `amount`, `paymentMethod`, `paymentStatus`, `transactionID`) VALUES
(@erenBookingID, 1, 2250.00, 'Scout Regiment Funds', 'Confirmed', 'TXN_AOT_001');

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(2, 2, 720.00, 'Pending'); -- Mikasa, Wall Sina Tour

SET @mikasaBookingID = LAST_INSERT_ID();

INSERT INTO `HotelBooking` (`bookingID`, `hotelID`, `checkinDate`, `checkoutDate`, `numberOfRooms`, `pricePerNight`) VALUES
(@mikasaBookingID, 2, '2026-02-10', '2026-02-13', 1, 100.00);

INSERT INTO `Payments` (`bookingID`, `userID`, `amount`, `paymentMethod`, `paymentStatus`, `transactionID`) VALUES
(@mikasaBookingID, 2, 720.00, 'Credit Card', 'Confirmed', 'TXN_AOT_002');

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(4, 3, 3000.00, 'Completed'); -- Levi, Marleyan Recon

SET @leviBookingID = LAST_INSERT_ID();

INSERT INTO `Payments` (`bookingID`, `userID`, `amount`, `paymentMethod`, `paymentStatus`, `transactionID`) VALUES
(@leviBookingID, 4, 3000.00, 'Scout Regiment Funds', 'Confirmed', 'TXN_AOT_003');

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(3, 1, 2250.00, 'Cancelled'); -- Armin, Shiganshina Expedition

SET @arminBookingID = LAST_INSERT_ID();

UPDATE `Booking` SET `BookingStatus` = 'Cancelled' WHERE `bookingID` = @arminBookingID;

-- Additional Bookings (Insert one at a time to capture bookingIDs)
INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(6, 5, 2340.00, 'Confirmed'); -- Jean, Wall Maria Restoration
SET @jeanBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(7, 7, 1400.00, 'Pending'); -- Connie, Liberio Festival
SET @connieBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(8, 4, 1800.00, 'Completed'); -- Sasha, Titan Study
SET @sashaBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(10, 3, 3000.00, 'Confirmed'); -- Reiner, Marleyan Recon
SET @reinerBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(11, 6, 2800.00, 'Pending'); -- Annie, Hizuru Exchange
SET @annieBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(13, 8, 1350.00, 'Completed'); -- Zeke, Mitras Tour
SET @zekeBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(15, 9, 1080.00, 'Confirmed'); -- Porco, Ragako Tour
SET @porcoBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(16, 2, 720.00, 'Pending'); -- Falco, Wall Sina Tour
SET @falcoBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(18, 1, 2250.00, 'Confirmed'); -- Ymir, Shiganshina Expedition
SET @ymirBookingID = LAST_INSERT_ID();

INSERT INTO `Booking` (`userID`, `packageID`, `BookingPrice`, `BookingStatus`) VALUES
(19, 5, 2340.00, 'Completed'); -- Erwin, Wall Maria Restoration
SET @erwinBookingID = LAST_INSERT_ID();

-- Hotel Bookings for Additional Bookings
INSERT INTO `HotelBooking` (`bookingID`, `hotelID`, `checkinDate`, `checkoutDate`, `numberOfRooms`, `pricePerNight`) VALUES
(@jeanBookingID, 8, '2026-04-05', '2026-04-15', 1, 60.00),
(@connieBookingID, 6, '2026-07-10', '2026-07-14', 2, 80.00),
(@sashaBookingID, 1, '2025-05-01', '2025-05-06', 1, 40.00),
(@reinerBookingID, 3, '2025-10-15', '2025-10-29', 1, 50.00),
(@annieBookingID, 7, '2026-07-20', '2026-08-01', 1, 150.00),
(@zekeBookingID, 5, '2026-01-10', '2026-01-13', 1, 200.00),
(@porcoBookingID, 9, '2025-10-05', '2025-10-07', 1, 70.00),
(@falcoBookingID, 2, '2026-02-15', '2026-02-18', 1, 100.00),
(@ymirBookingID, 4, '2025-06-01', '2025-06-08', 1, 50.00),
(@erwinBookingID, 8, '2026-04-10', '2026-04-20', 1, 60.00);

-- Activity Bookings
INSERT INTO `ActivityBooking` (`bookingID`, `activityID`, `Date`, `numberOfParticipants`, `totalPrice`) VALUES
(@jeanBookingID, 8, '2026-04-07', 1, 90.00),
(@connieBookingID, 6, '2026-07-11', 2, 160.00),
(@sashaBookingID, 1, '2025-05-02', 1, 150.00),
(@reinerBookingID, 6, '2025-10-16', 1, 80.00),
(@annieBookingID, 7, '2026-07-22', 1, 120.00),
(@zekeBookingID, 10, '2026-01-11', 1, 100.00),
(@porcoBookingID, 9, '2025-10-06', 1, 60.00),
(@falcoBookingID, 4, '2026-02-16', 1, 75.00),
(@ymirBookingID, 2, '2025-06-02', 1, 200.00),
(@erwinBookingID, 8, '2026-04-12', 1, 90.00);

-- Transport Bookings
INSERT INTO `TransportBooking` (`transportID`, `bookingID`, `departureDate`, `arrivalDate`, `departureLocation`, `arrivalLocation`, `seatsBooked`, `totalPrice`) VALUES
(7, @jeanBookingID, '2026-04-05 07:00:00', '2026-04-05 09:00:00', 'Trost District', 'Wall Maria', 1, 45.00),
(5, @connieBookingID, '2026-07-10 06:00:00', '2026-07-10 20:00:00', 'Paradis Island', 'Liberio', 2, 1000.00),
(3, @sashaBookingID, '2025-05-01 09:00:00', '2025-05-01 09:30:00', 'Shiganshina District', 'Trost District', 1, 100.00),
(2, @reinerBookingID, '2025-10-15 05:00:00', '2025-10-15 15:00:00', 'Paradis Island', 'Marley', 1, 300.00),
(5, @annieBookingID, '2026-07-20 08:00:00', '2026-07-20 22:00:00', 'Marley', 'Hizuru', 1, 500.00),
(4, @zekeBookingID, '2026-01-10 07:00:00', '2026-01-10 10:00:00', 'Stohess District', 'Mitras', 1, 75.00),
(7, @porcoBookingID, '2025-10-05 08:00:00', '2025-10-05 09:30:00', 'Liberio', 'Ragako Village', 1, 45.00),
(1, @falcoBookingID, '2026-02-15 09:00:00', '2026-02-15 11:00:00', 'Trost District', 'Stohess District', 1, 50.00),
(3, @ymirBookingID, '2025-06-01 08:00:00', '2025-06-01 08:45:00', 'Wall Maria', 'Shiganshina District', 1, 100.00),
(7, @erwinBookingID, '2026-04-10 07:00:00', '2026-04-10 09:00:00', 'Mitras', 'Wall Maria', 1, 45.00);

-- Payments
INSERT INTO `Payments` (`bookingID`, `userID`, `amount`, `paymentMethod`, `paymentStatus`, `transactionID`) VALUES
(@jeanBookingID, 6, 2340.00, 'Credit Card', 'Confirmed', 'TXN_AOT_004'),
(@connieBookingID, 7, 1400.00, 'GCash', 'Pending', 'TXN_AOT_005'),
(@sashaBookingID, 8, 1800.00, 'Scout Regiment Funds', 'Confirmed', 'TXN_AOT_006'),
(@reinerBookingID, 10, 3000.00, 'Bank Transfer', 'Confirmed', 'TXN_AOT_007'),
(@annieBookingID, 11, 2800.00, 'Credit Card', 'Pending', 'TXN_AOT_008'),
(@zekeBookingID, 13, 1350.00, 'Bank Transfer', 'Confirmed', 'TXN_AOT_009'),
(@porcoBookingID, 15, 1080.00, 'Credit Card', 'Confirmed', 'TXN_AOT_010'),
(@falcoBookingID, 16, 720.00, 'GCash', 'Pending', 'TXN_AOT_011'),
(@ymirBookingID, 18, 2250.00, 'Scout Regiment Funds', 'Confirmed', 'TXN_AOT_012'),
(@erwinBookingID, 19, 2340.00, 'Bank Transfer', 'Confirmed', 'TXN_AOT_013');

-- Reviews
INSERT INTO `Reviews` (`userID`, `packageID`, `hotelID`, `activityID`, `bookingID`, `reviewDate`, `rating`, `comment`) VALUES
(4, 3, NULL, NULL, @leviBookingID, '2025-12-15', 5, 'Efficient and effective. Minimal casualties. The tea in Marley is subpar, however.'),
(1, NULL, 4, NULL, @erenBookingID, '2025-06-01', 4, 'The Shiganshina mission was tough, but we made progress! The camp was basic but functional.'),
(2, 2, NULL, NULL, @mikasaBookingID, '2026-02-14', 3, 'Stohess was... opulent. Too many nobles, not enough action. Hotel was clean.'),
(6, 5, NULL, NULL, @jeanBookingID, '2026-04-16', 4, 'Hard work rebuilding Wall Maria, but worth it. Outpost was rough but got the job done.'),
(8, NULL, NULL, 1, @sashaBookingID, '2025-05-07', 5, 'ODM Gear training was a blast! Ate some potatoes during the break.'),
(10, 3, NULL, NULL, @reinerBookingID, '2025-10-30', 3, 'Marley recon was intense. Lodging in Liberio was cramped.'),
(13, NULL, 5, NULL, @zekeBookingID, '2026-01-14', 5, 'Mitras Inn was top-notch. Felt like royalty.'),
(19, 5, NULL, NULL, @erwinBookingID, '2026-04-21', 4, 'Leading the Wall Maria restoration was an honor. Good teamwork.');

-- Verify data
SELECT * FROM `Users`;
SELECT * FROM `Destinations`;
SELECT * FROM `Seasons`;
SELECT * FROM `TourPackage`;
SELECT * FROM `Booking`;
SELECT * FROM `Payments`;
SELECT * FROM `Hotel`;
SELECT * FROM `HotelBooking`;
SELECT * FROM `Activities`;
SELECT * FROM `ActivityBooking`;
SELECT * FROM `Transportation`;
SELECT * FROM `TransportBooking`;
SELECT * FROM `Reviews`;
SELECT * FROM `AuditLog`;
SELECT b.bookingID, u.FirstName, u.LastName, p.PackageName, b.BookingPrice, b.BookingStatus
FROM `Booking` b
JOIN `Users` u ON b.userID = u.userID
LEFT JOIN `TourPackage` p ON b.packageID = p.packageID
ORDER BY b.bookingID;