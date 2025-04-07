const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  Booking_ID: { type: String, required: true, unique: true },
  truckpartner: { type: String, required: true },
  total_trip: { type: Number, required: true },
  start_time: { type: Date, required: true },
  expiry_time: { type: Date, required: true },
  today_earning: { type: Number, required: true },
  total_earning: { type: Number, required: true }
});

module.exports = mongoose.model('Ride', rideSchema);


