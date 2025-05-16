// routes/bookings.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create a booking
router.post("/", async (req, res) => {
	const { userID, packageID, BookingPrice, BookingStatus } = req.body;
	if (!userID || !BookingPrice || !BookingStatus) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"INSERT INTO Booking (userID, packageID, BookingPrice, BookingStatus) VALUES (?, ?, ?, ?)",
			[userID, packageID || null, BookingPrice, BookingStatus]
		);
		res
			.status(201)
			.json({ bookingID: result.insertId, message: "Booking created" });
	} catch (err) {
		res.status(500).json({ error: "Failed to create booking" });
	}
});

// Read all bookings
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query(`
      SELECT b.*, u.FirstName, u.LastName, p.PackageName
      FROM Booking b
      JOIN Users u ON b.userID = u.userID
      LEFT JOIN TourPackage p ON b.packageID = p.packageID
    `);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch bookings" });
	}
});

// Read a single booking
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query(
			`
      SELECT b.*, u.FirstName, u.LastName, p.PackageName
      FROM Booking b
      JOIN Users u ON b.userID = u.userID
      LEFT JOIN TourPackage p ON b.packageID = p.packageID
      WHERE b.bookingID = ?
      `,
			[id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Booking not found" });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch booking" });
	}
});

// Update a booking
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { userID, packageID, BookingPrice, BookingStatus } = req.body;
	if (!userID || !BookingPrice || !BookingStatus) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"UPDATE Booking SET userID = ?, packageID = ?, BookingPrice = ?, BookingStatus = ? WHERE bookingID = ?",
			[userID, packageID || null, BookingPrice, BookingStatus, id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Booking not found" });
		}
		res.json({ message: "Booking updated" });
	} catch (err) {
		res.status(500).json({ error: "Failed to update booking" });
	}
});

// Delete a booking
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query(
			"DELETE FROM Booking WHERE bookingID = ?",
			[id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Booking not found" });
		}
		res.json({ message: "Booking deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete booking" });
	}
});

module.exports = router;
