const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Admin stats for dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [totalBuses, activeBuses, totalRoutes, totalBookings, totalUsers] = await Promise.all([
      Bus.countDocuments(),
      Bus.countDocuments({ status: 'active' }),
      Route.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      User.countDocuments(),
    ]);

    res.json({
      totalBuses,
      activeBuses,
      totalRoutes,
      totalBookings,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats };

