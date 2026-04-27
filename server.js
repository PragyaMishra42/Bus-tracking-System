const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/* ===============================
   DATABASE
================================= */
connectDB();

/* ===============================
   MIDDLEWARE
================================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   STATIC FRONTEND
================================= */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ===============================
   API ROUTES
================================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/buses", require("./routes/busRoutes"));
app.use("/api/routes", require("./routes/routeRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

/* ===============================
   FRONTEND PAGES
================================= */
const frontendPath = path.join(__dirname, "../frontend");

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(frontendPath, "register.html"));
});

app.get("/student-dashboard", (req, res) => {
  res.sendFile(path.join(frontendPath, "student-dashboard.html"));
});

app.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin-dashboard.html"));
});

app.get("/driver-dashboard", (req, res) => {
  res.sendFile(path.join(frontendPath, "driver-dashboard.html"));
});

/* ===============================
   404 HANDLER
================================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

/* ===============================
   START SERVER
================================= */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(` Server Running on Port ${PORT}`);
});