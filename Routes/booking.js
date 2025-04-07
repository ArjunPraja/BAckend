const express = require('express');
const router = express.Router();
const {
  createOrder,
  confirmBooking,
} = require('../Controller/bookingsController');

router.post('/create-order', createOrder);
router.post('/confirm', confirmBooking);

module.exports = router;
