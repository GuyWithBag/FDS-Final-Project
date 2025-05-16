// routes/users.js
const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Create a user
router.post("/", async (req, res) => {
	const { FirstName, LastName, EmailAddress, PhoneNumber, PasswordHash } =
		req.body;
	if (!FirstName || !LastName || !EmailAddress || !PasswordHash) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"INSERT INTO Users (FirstName, LastName, EmailAddress, PhoneNumber, PasswordHash) VALUES (?, ?, ?, ?, ?)",
			[FirstName, LastName, EmailAddress, PhoneNumber || null, PasswordHash]
		);
		res.status(201).json({ userID: result.insertId, message: "User created" });
	} catch (err) {
		res.status(500).json({ error: "Failed to create user" });
	}
});

// Read all users
router.get("/", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM Users");
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

// Read a single user
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.query("SELECT * FROM Users WHERE userID = ?", [
			id,
		]);
		if (rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch user" });
	}
});

// Update a user
router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { FirstName, LastName, EmailAddress, PhoneNumber, PasswordHash } =
		req.body;
	if (!FirstName || !LastName || !EmailAddress || !PasswordHash) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const [result] = await pool.query(
			"UPDATE Users SET FirstName = ?, LastName = ?, EmailAddress = ?, PhoneNumber = ?, PasswordHash = ? WHERE userID = ?",
			[FirstName, LastName, EmailAddress, PhoneNumber || null, PasswordHash, id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json({ message: "User updated" });
	} catch (err) {
		res.status(500).json({ error: "Failed to update user" });
	}
});

// Delete a user
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const [result] = await pool.query("DELETE FROM Users WHERE userID = ?", [
			id,
		]);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json({ message: "User deleted" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete user" });
	}
});

module.exports = router;
