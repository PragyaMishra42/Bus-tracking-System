const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// @desc    Book a seat
// @route   POST /api/bookings
// @access  Private
const bookSeat = async (req, res) => {
  try {
    const { busId, routeId, seatNumber } = req.body;

    // Check if bus has available seats
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    if (bus.seatsAvailable <= 0) return res.status(400).json({ message: 'No seats available' });

    // Check if seat is already booked (simplified logic)
    const existingBooking = await Booking.findOne({ busId, routeId, seatNumber, status: 'confirmed' });
    if (existingBooking) return res.status(400).json({ message: 'Seat already booked' });

    const booking = new Booking({
      userId: req.user._id,
      busId,
      routeId,
      seatNumber
    });

    await booking.save();
    
    // Decrement available seats
    bus.seatsAvailable -= 1;
    await bus.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings (admin: all, others: own)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const bookings = await Booking.find(filter)
      .populate('userId', 'name email role')
      .populate('busId', 'busNumber capacity seatsAvailable status')
      .populate('routeId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('busId', 'busNumber').populate('routeId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const bus = await Bus.findById(booking.busId);
    if(bus) {
      bus.seatsAvailable += 1;
      await bus.save();
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookSeat, getBookings, getMyBookings, cancelBooking };
