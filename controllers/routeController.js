const Route = require('../models/Route');

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({}).sort({ createdAt: -1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a route
// @route   POST /api/routes
// @access  Private/Admin
const createRoute = async (req, res) => {
  try {
    const { source, destination, stops } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ message: 'source and destination are required' });
    }

    const route = await Route.create({
      source: String(source).trim(),
      destination: String(destination).trim(),
      stops: Array.isArray(stops) ? stops : [],
    });

    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRoutes, createRoute };

