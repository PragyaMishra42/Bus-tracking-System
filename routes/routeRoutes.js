const express = require('express');
const router = express.Router();
const { getRoutes, createRoute } = require('../controllers/routeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/').get(getRoutes).post(protect, authorize('admin'), createRoute);

module.exports = router;

