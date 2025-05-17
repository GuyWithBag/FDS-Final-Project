// server.js
const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users");
const bookingRoutes = require("./routes/bookings");
const tourPackageRoutes = require("./routes/tourPackages");
const destinationRoutes = require("./routes/destinations");
const hotelRoutes = require("./routes/hotels");
const activityRoutes = require("./routes/activities");
const transportationRoutes = require("./routes/transportation");
const paymentRoutes = require("./routes/payments");
// In backend/server.js
const cors = require("cors");
dotenv.config();
  
const app = express();
const port = process.env.PORT || 3001;
  
app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tour-packages", tourPackageRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/transportation", transportationRoutes);
app.use("/api/payments", paymentRoutes);

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