// routes/tourPackages.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create a tour package
router.post("/", async (req, res) => {
	const { PackageName, BasePrice, DurationDays, seasonID, Description } =
		req.body;
	if (!PackageName || !BasePrice || !DurationDays) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"INSERT INTO TourPackage (PackageName, BasePrice, DurationDays, seasonID, Description) VALUES (?, ?, ?, ?, ?)",
			[
				PackageName,
				BasePrice,
				DurationDays,
				seasonID || null,
				Description || null,
			]
		);
		res
			.status(201)
			.json({ packageID: result.insertId, message: "Tour package created" });
	} catch (err) {
		res.status(500).json({ error: "Failed to create tour package" });
	}
});

// Read all tour packages
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM TourPackage");
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch tour packages" });
	}
});

// Read a single tour package
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query(
			"SELECT * FROM TourPackage WHERE packageID = ?",
			[id]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Tour package not found" });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch tour package" });
	}
});

// Update a tour package
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { PackageName, BasePrice, DurationDays, seasonID, Description } =
		req.body;
	if (!PackageName || !BasePrice || !DurationDays) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"UPDATE TourPackage SET PackageName = ?, BasePrice = ?, DurationDays = ?, seasonID = ?, Description = ? WHERE packageID = ?",
			[
				PackageName,
				BasePrice,
				DurationDays,
				seasonID || null,
				Description || null,
				id,
			]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Tour package not found" });
		}
		res.json({ message: "Tour package updated" });
	} catch (err) {
		res.status(500).json({ error: "Failed to update tour package" });
	}
});

// Delete a tour package
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query(
			"DELETE FROM TourPackage WHERE packageID = ?",
			[id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Tour package not found" });
		}
		res.json({ message: "Tour package deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete tour package" });
	}
});

module.exports = router;
