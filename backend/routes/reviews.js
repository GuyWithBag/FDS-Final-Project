const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// GET all reviews (with joins for user and reviewed item names)
router.get('/', async (req, res) => {
  try {
    // This query fetches reviews and attempts to join with Users, TourPackage, Hotel, and Activities
    // It uses LEFT JOINs and COALESCE to handle cases where a review might only be for one type of item
    const [rows] = await pool.query(`
      SELECT 
        r.reviewID,
        r.userID,
        r.packageID,
        r.hotelID,
        r.activityID,
        r.bookingID,
        r.reviewDate,
        r.rating,
        r.comment,
        u.FirstName,
        u.LastName,
        tp.PackageName,
        h.hotelName AS HotelName, -- Alias to match frontend type
        a.activityName AS ActivityName -- Alias to match frontend type
      FROM Reviews r
      JOIN Users u ON r.userID = u.userID
      LEFT JOIN TourPackage tp ON r.packageID = tp.packageID
      LEFT JOIN Hotel h ON r.hotelID = h.hotelID
      LEFT JOIN Activities a ON r.activityID = a.activityID
      ORDER BY r.reviewDate DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST a new review
router.post('/', async (req, res) => {
  const { userID, packageID, hotelID, activityID, bookingID, rating, comment } = req.body;

  // Basic validation: A review must be linked to at least one item (package, hotel, activity, or booking)
  if (!userID || !rating || rating < 1 || rating > 5 || (!packageID && !hotelID && !activityID && !bookingID)) {
    return res.status(400).json({ error: 'Missing required fields or invalid data.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO Reviews (userID, packageID, hotelID, activityID, bookingID, reviewDate, rating, comment) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?)',
      [userID, packageID || null, hotelID || null, activityID || null, bookingID || null, rating, comment || null]
    );
    res.status(201).json({ reviewID: result.insertId, message: 'Review submitted successfully' });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// TODO: Add PUT and DELETE endpoints for reviews if needed for full CRUD demo

module.exports = router; 