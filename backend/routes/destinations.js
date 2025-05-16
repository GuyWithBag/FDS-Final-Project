// routes/destinations.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create a destination
router.post("/", async (req, res) => {
	const { DestinationName, Country, Description } = req.body;
	if (!DestinationName || !Country) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"INSERT INTO Destinations (DestinationName, Country, Description) VALUES (?, ?, ?)",
			[DestinationName, Country, Description || null]
		);
		res.status(201).json({
			destinationID: result.insertId,
			message: "Destination created",
		});
	} catch (err) {
		res.status(500).json({ error: "Failed to create destination" });
	}
});

// Read all destinations
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM Destinations");
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch destinations" });
	}
});

// Read a single destination
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query(
			"SELECT * FROM Destinations WHERE destinationID = ?",
			[id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Destination not found" });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch destination" });
	}
});

// Update a destination
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { DestinationName, Country, Description } = req.body;
	if (!DestinationName || !Country) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"UPDATE Destinations SET DestinationName = ?, Country = ?, Description = ? WHERE destinationID = ?",
			[DestinationName, Country, Description || null, id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Destination not found" });
		}
		res.json({ message: "Destination updated" });
	} catch (err) {
		res.status(500).json({ error: "Failed to update destination" });
	}
});

// Delete a destination
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query(
			"DELETE FROM Destinations WHERE destinationID = ?",
			[id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Destination not found" });
		}
		res.json({ message: "Destination deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete destination" });
	}
});

module.exports = router;