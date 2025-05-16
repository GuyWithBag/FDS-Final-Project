// routes/transportation.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create a transportation option
router.post("/", async (req, res) => {
	const { TransportType, Rate, ServiceProvider, Capacity } = req.body;
	if (!TransportType || !Rate) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"INSERT INTO Transportation (TransportType, Rate, ServiceProvider, Capacity) VALUES (?, ?, ?, ?)",
			[TransportType, Rate, ServiceProvider || null, Capacity || null]
		);
		res.status(201).json({ transportID: result.insertId, message: "Transportation option created" });
	} catch (err) {
		res.status(500).json({ error: "Failed to create transportation option" });
	}
});

// Read all transportation options
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM Transportation");
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch transportation options" });
	}
});

// Read a single transportation option
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query(
			"SELECT * FROM Transportation WHERE transportID = ?",
			[id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Transportation option not found" });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch transportation option" });
	}
});

// Update a transportation option
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { TransportType, Rate, ServiceProvider, Capacity } = req.body;
	if (!TransportType || !Rate) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"UPDATE Transportation SET TransportType = ?, Rate = ?, ServiceProvider = ?, Capacity = ? WHERE transportID = ?",
			[TransportType, Rate, ServiceProvider || null, Capacity || null, id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Transportation option not found" });
		}
		res.json({ message: "Transportation option updated" });
	} catch (err) {
		res.status(500).json({ error: "Failed to update transportation option" });
	}
});

// Delete a transportation option
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query(
			"DELETE FROM Transportation WHERE transportID = ?",
			[id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Transportation option not found" });
		}
		res.json({ message: "Transportation option deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete transportation option" });
	}
});

module.exports = router;