const express = require('express');
const router = express.Router();
const Ride = require('../Models/Rides');
const {Booking} = require('../Models/Booking');
// ✅ POST /api/rides - Add a new ride
router.post('/', async (req, res) => {
  try {
    const {
      Booking_ID,
      truckpartner,
      total_trip,
      start_time,
      expiry_time,
      today_earning,
      total_earning
    } = req.body;

    const newRide = new Ride({
      Booking_ID,
      truckpartner,
      total_trip,
      start_time,
      expiry_time,
      today_earning,
      total_earning
    });

    const savedRide = await newRide.save();
    res.status(201).json({
      message: 'Ride added successfully',
      data: savedRide
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ride with this Booking_ID already exists." });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET ride history with booking details for a truck partner
router.get("/partner/:partnerId", async (req, res) => {
  try {
    const partnerId = req.params.partnerId;

    // Find rides for the specific truck partner
    const rides = await Ride.find({ truckpartner: partnerId }).sort({ start_time: -1 });

    // Combine each ride with its booking info
    const detailedRides = await Promise.all(
      rides.map(async (ride) => {
        let bookingDetails = null;
        try {
          bookingDetails = await Booking.findById(ride.Booking_ID);
        } catch (err) {
          console.warn(`Booking not found for Booking_ID: ${ride.Booking_ID}`);
        }

        return {
          ...ride._doc,
          bookingDetails, // Will be null if not found
        };
      })
    );

    res.status(200).json({ data: detailedRides });
  } catch (err) {
    console.error("Error fetching ride and booking details:", err);
    res.status(500).json({ error: "Failed to fetch ride and booking data" });
  }
});








router.get('/wallet/summary/:truckpartnerId', async (req, res) => {
  try {
    const { truckpartnerId } = req.params;
    console.log('Truck Partner ID:', truckpartnerId);

    // Fetch all rides associated with the given truck partner
    const rides = await Ride.find({ truckpartner: truckpartnerId });

    // Calculate wallet summary details
    const totalRides = rides.length;
    const totalEarning = rides.reduce((sum, ride) => sum + (ride.total_earning || 0), 0);
    const todayEarning = rides.reduce((sum, ride) => sum + (ride.today_earning || 0), 0);
    const totalTrips = rides.reduce((sum, ride) => sum + (ride.total_trip || 0), 0);
    const withdrawableAmount = totalEarning ;

    console.log({
      totalRides,
      totalEarning,
      todayEarning,
      totalTrips,
      withdrawableAmount
    });

    // Respond with wallet summary
    res.json({
      totalRides,
      totalTrips,
      totalEarning,
      todayEarning,
      withdrawableAmount
    });

  } catch (err) {
    console.error('Error fetching wallet summary:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});




router.post('/wallet/withdraw', async (req, res) => {
  try {
    const { truckpartnerId, amount, account_holder_name, account_number, ifsc_code } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    const rides = await Ride.find({ truckpartner: truckpartnerId });
    const totalEarning = rides.reduce((sum, ride) => sum + ride.total_earning, 0);
    const todayEarning = rides.reduce((sum, ride) => sum + ride.today_earning, 0);
    const withdrawableAmount = totalEarning - todayEarning;

    if (amount > withdrawableAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = new Transactions({
      truckpartner: truckpartnerId,
      rides: rides[0]?._id, // or handle as needed
      account_holder_name,
      account_number,
      ifsc_code,
      amount,
      type: 'debit'
    });

    await transaction.save();

    res.json({ message: 'Withdrawal successful', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});





module.exports = router;
