// server.js
const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users");
const bookingRoutes = require("./routes/bookings");
const tourPackageRoutes = require("./routes/tourPackages");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
console.log(userRoutes);
// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tour-packages", tourPackageRoutes);

// Root endpoint
app.get("/", (req, res) => {
	res.json({ message: "Welcome to the Travel DB API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
