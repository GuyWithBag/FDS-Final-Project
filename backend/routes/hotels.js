// routes/hotels.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create a hotel
router.post("/", async (req, res) => {
	const { hotelName, PhoneNumber, Location, destinationID, Description, StarRating } = req.body;
	if (!hotelName || !Location || !destinationID) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"INSERT INTO Hotel (hotelName, PhoneNumber, Location, destinationID, Description, StarRating) VALUES (?, ?, ?, ?, ?, ?)",
			[hotelName, PhoneNumber || null, Location, destinationID, Description || null, StarRating || null]
		);
		res.status(201).json({ hotelID: result.insertId, message: "Hotel created" });
	} catch (err) {
		res.status(500).json({ error: "Failed to create hotel" });
	}
});

// Read all hotels
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query(`
			SELECT h.*, d.DestinationName 
			FROM Hotel h
			JOIN Destinations d ON h.destinationID = d.destinationID
		`);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch hotels" });
	}
});

// Read a single hotel
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query(`
			SELECT h.*, d.DestinationName 
			FROM Hotel h
			JOIN Destinations d ON h.destinationID = d.destinationID
			WHERE h.hotelID = ?
		`, [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Hotel not found" });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch hotel" });
	}
});

// Update a hotel
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { hotelName, PhoneNumber, Location, destinationID, Description, StarRating } = req.body;
	if (!hotelName || !Location || !destinationID) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"UPDATE Hotel SET hotelName = ?, PhoneNumber = ?, Location = ?, destinationID = ?, Description = ?, StarRating = ? WHERE hotelID = ?",
			[hotelName, PhoneNumber || null, Location, destinationID, Description || null, StarRating || null, id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Hotel not found" });
		}
		res.json({ message: "Hotel updated" });
	} catch (err) {
		res.status(500).json({ error: "Failed to update hotel" });
	}
});

// Delete a hotel
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query(
			"DELETE FROM Hotel WHERE hotelID = ?",
			[id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Hotel not found" });
		}
		res.json({ message: "Hotel deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete hotel" });
	}
});

module.exports = router;