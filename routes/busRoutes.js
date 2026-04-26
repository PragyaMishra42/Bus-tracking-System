const express = require('express');
const router = express.Router();
const { 
  getBuses, 
  getActiveBuses,
  addBus, 
  updateBus,
  deleteBus,
  getRoutes, 
  addRoute,
  getSchedules,
  addSchedule,
  getBusLocation,
  updateBusLocation,
  getBusStats
} = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Bus routes
router.route('/').get(getBuses).post(protect, authorize('admin'), addBus);
router.route('/active').get(getActiveBuses);
router.route('/stats').get(getBusStats);
router.route('/:id').put(protect, authorize('admin'), updateBus).delete(protect, authorize('admin'), deleteBus);

// Location routes
router.route('/:id/location').get(getBusLocation).put(protect, authorize('driver'), updateBusLocation);

// Route management routes
router.route('/routes').get(getRoutes).post(protect, authorize('admin'), addRoute);

// Schedule routes
router.route('/schedules').get(getSchedules).post(protect, authorize('admin'), addSchedule);

module.exports = router;
