const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');
const Location = require('../models/Location');
const Booking = require('../models/Booking');

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find({}).populate('driver', 'name email');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active buses count
// @route   GET /api/buses/active
// @access  Public
const getActiveBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ status: 'active' }).populate('driver', 'name email');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a bus
// @route   POST /api/buses
// @access  Private/Admin
const addBus = async (req, res) => {
  try {
    const { busNumber, capacity, driver } = req.body;
    const bus = new Bus({
      busNumber,
      capacity,
      seatsAvailable: capacity,
      driver: driver || null
    });
    const createdBus = await bus.save();
    await createdBus.populate('driver', 'name email');
    res.status(201).json(createdBus);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bus number already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bus status
// @route   PUT /api/buses/:id
// @access  Private/Admin
const updateBus = async (req, res) => {
  try {
    const { status, seatsAvailable } = req.body;
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { status, seatsAvailable },
      { new: true }
    ).populate('driver', 'name email');
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json({ message: 'Bus removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all routes
// @route   GET /api/buses/routes
// @access  Public
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({});
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a route
// @route   POST /api/buses/routes
// @access  Private/Admin
const addRoute = async (req, res) => {
  try {
    const { source, destination, stops } = req.body;
    const route = new Route({ source, destination, stops });
    const createdRoute = await route.save();
    res.status(201).json(createdRoute);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Route already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all schedules with populated data
// @route   GET /api/buses/schedules
// @access  Public
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({})
      .populate('routeId')
      .populate({
        path: 'busId',
        populate: { path: 'driver', select: 'name email' }
      });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a schedule
// @route   POST /api/buses/schedules
// @access  Private/Admin
const addSchedule = async (req, res) => {
  try {
    const { routeId, busId, departureTime } = req.body;
    const schedule = new Schedule({
      routeId,
      busId,
      departureTime: new Date(departureTime)
    });
    const createdSchedule = await schedule.save();
    await createdSchedule.populate('routeId').populate('busId');
    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get live location of a bus
// @route   GET /api/buses/:id/location
// @access  Public
const getBusLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ busId: req.params.id });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bus location (called by driver)
// @route   PUT /api/buses/:id/location
// @access  Private/Driver
const updateBusLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    let location = await Location.findOne({ busId: req.params.id });
    
    if (!location) {
      location = new Location({ busId: req.params.id, latitude, longitude });
    } else {
      location.latitude = latitude;
      location.longitude = longitude;
    }
    
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bus stats for dashboard
// @route   GET /api/buses/stats
// @access  Public
const getBusStats = async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments();
    const activeBuses = await Bus.countDocuments({ status: 'active' });
    const totalRoutes = await Route.countDocuments();
    const totalBookings = await Booking.countDocuments({ status: 'confirmed' });
    
    res.json({
      totalBuses,
      activeBuses,
      totalRoutes,
      totalBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
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
};
