// routes/payments.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create a payment
router.post("/", async (req, res) => {
	const { bookingID, userID, amount, paymentMethod, paymentStatus, transactionID } = req.body;
	if (!bookingID || !userID || !amount || !paymentMethod) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"INSERT INTO Payments (bookingID, userID, amount, paymentMethod, paymentStatus, transactionID) VALUES (?, ?, ?, ?, ?, ?)",
			[bookingID, userID, amount, paymentMethod, paymentStatus || 'Pending', transactionID || null]
		);
		res.status(201).json({ paymentID: result.insertId, message: "Payment created" });
	} catch (err) {
		res.status(500).json({ error: "Failed to create payment" });
	}
});

// Read all payments
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query(`
			SELECT p.*, u.FirstName, u.LastName, b.BookingStatus 
			FROM Payments p
			JOIN Users u ON p.userID = u.userID
			JOIN Booking b ON p.bookingID = b.bookingID
		`);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch payments" });
	}
});

// Read a single payment
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query(`
			SELECT p.*, u.FirstName, u.LastName, b.BookingStatus 
			FROM Payments p
			JOIN Users u ON p.userID = u.userID
			JOIN Booking b ON p.bookingID = b.bookingID
			WHERE p.paymentID = ?
		`, [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Payment not found" });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch payment" });
	}
});

// Update a payment
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { bookingID, userID, amount, paymentMethod, paymentStatus, transactionID } = req.body;
	if (!bookingID || !userID || !amount || !paymentMethod || !paymentStatus) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"UPDATE Payments SET bookingID = ?, userID = ?, amount = ?, paymentMethod = ?, paymentStatus = ?, transactionID = ? WHERE paymentID = ?",
			[bookingID, userID, amount, paymentMethod, paymentStatus, transactionID || null, id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Payment not found" });
		}
		res.json({ message: "Payment updated" });
	} catch (err) {
		res.status(500).json({ error: "Failed to update payment" });
	}
});

// Delete a payment
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query(
			"DELETE FROM Payments WHERE paymentID = ?",
			[id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Payment not found" });
		}
		res.json({ message: "Payment deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete payment" });
	}
});

module.exports = router;