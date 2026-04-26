const express = require('express');
const router = express.Router();
const { bookSeat, getBookings, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBookings).post(protect, bookSeat);
router.route('/my-bookings').get(protect, getMyBookings);
router.route('/:id').delete(protect, cancelBooking);

module.exports = router;
