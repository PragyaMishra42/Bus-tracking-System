const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  departureTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
