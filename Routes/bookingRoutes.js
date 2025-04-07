const express = require('express');
const router = express.Router();
const Booking = require('../Models/Booking');
const Auth = require('../Middleware/Auth');

router.get("/my-bookings", Auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userid: userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
