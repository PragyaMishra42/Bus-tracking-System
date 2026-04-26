const express = require("express");
const cors = require("cors");
const connectDB = require("../backend/config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/buses', require('../backend/routes/busRoutes'));
app.use('/api/bookings', require('../backend/routes/bookingRoutes'));
app.use('/api/routes', require('../backend/routes/routeRoutes'));
app.use('/api/admin', require('../backend/routes/adminRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: "Backend Running on Vercel 🚀" });
});

module.exports = app;