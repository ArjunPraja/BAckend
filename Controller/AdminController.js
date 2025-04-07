const express = require('express');
const router = express.Router();
const { User } = require('../Models/User');
const TruckPartner = require('../Models/TrucPartner');
const Ride = require('../Models/Rides');
const { Contact } = require('../Models/Contact');
const { Booking } = require('../Models/Booking');
const Transaction = require('../Models/Transaction');

/**
 * @route GET /api/users
 * @description Get all users (without passwords)
 */
router.get('/users', async (req, res) => {
  try {
    
    const users = await User.find().select('-password');
    console.log(users)
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

 
router.get('/rides', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route GET /api/contacts
 * @description Get all contacts
 */
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route GET /api/bookings
 * @description Get all bookings
 */
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route GET /api/transactions
 * @description Get all transactions
 */
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
  
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;