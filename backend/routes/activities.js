// routes/activities.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create an activity
router.post("/", async (req, res) => {
	const { activityName, destinationID, Price, Description, DurationHours } = req.body;
	if (!activityName || !destinationID || !Price) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"INSERT INTO Activities (activityName, destinationID, Price, Description, DurationHours) VALUES (?, ?, ?, ?, ?)",
			[activityName, destinationID, Price, Description || null, DurationHours || null]
		);
		res.status(201).json({ activityID: result.insertId, message: "Activity created" });
	} catch (err) {
		res.status(500).json({ error: "Failed to create activity" });
	}
});

// Read all activities
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query(`
			SELECT a.*, d.DestinationName 
			FROM Activities a
			JOIN Destinations d ON a.destinationID = d.destinationID
		`);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch activities" });
	}
});

// Read a single activity
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query(`
			SELECT a.*, d.DestinationName 
			FROM Activities a
			JOIN Destinations d ON a.destinationID = d.destinationID
			WHERE a.activityID = ?
		`, [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Activity not found" });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch activity" });
	}
});

// Update an activity
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { activityName, destinationID, Price, Description, DurationHours } = req.body;
	if (!activityName || !destinationID || !Price) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"UPDATE Activities SET activityName = ?, destinationID = ?, Price = ?, Description = ?, DurationHours = ? WHERE activityID = ?",
			[activityName, destinationID, Price, Description || null, DurationHours || null, id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Activity not found" });
		}
		res.json({ message: "Activity updated" });
	} catch (err) {
		res.status(500).json({ error: "Failed to update activity" });
	}
});

// Delete an activity
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query(
			"DELETE FROM Activities WHERE activityID = ?",
			[id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Activity not found" });
		}
		res.json({ message: "Activity deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete activity" });
	}
});

module.exports = router;