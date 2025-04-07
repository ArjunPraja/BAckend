require('dotenv').config();
const express = require('express');
const connectDB = require('./Conf/DB_config'); // Import database connection
const RegisterUser =require('./Controller/register');
const LoginUser = require('./Controller/login');
const bookingRoutes = require('./Routes/booking');
const buyPackageRoutes = require('./Routes/buyPackage');
const loginTruckPartner = require("./Controller/loginTruckPartner");
const Ride = require('./Models/Rides'); // update the path accordingly
const truckPartnerRoutes = require('./Routes/truckPartner');
const path = require('path'); // ✅ Required to fix your error
const adminApis=require('./Controller/AdminController')
const TruckPartner = require('./Models/TrucPartner')
const Transaction = require("./Models/Transaction")
const contactRoutes = require('./Routes/contactRoutes'); // adjust path
const { User } = require('./Models/User');
const {Contact } =require('./Models/Contact')
const app = express();
const port = process.env.PORT;
const cors = require("cors");
const  {Booking}  = require('./Models/Booking');
const rideRoutes = require('./Routes/rides');
const RegisterTruckPartner = require('./Controller/RegisterTruckPartner');
app.use(express.json());
const transactionRoutes = require('./Routes/Transactionroutes');


connectDB();

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true
}));

app.post('/partner/register', RegisterTruckPartner);
app.post('/register', RegisterUser);
app.post('/login',LoginUser)


// Routes
app.use('/api/bookings', bookingRoutes);
// Routes
app.use('/api/transactions', transactionRoutes);

app.use('/api/buy-package', buyPackageRoutes); 

app.use('/api/truckpartner', truckPartnerRoutes);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post("/partner/login", loginTruckPartner);

app.post("/admin/api", adminApis);





// Routes
app.use('/api/rides', rideRoutes);



// 1. Get all bookings with status = 'payment-status' and not present in Ride schema
app.get('/bookings/payment-status', async (req, res) => {
  try {
    // Get all bookings with status 'payment-status'
    const bookings = await Booking.find({ status: 'payment-status' });

    // Get all Booking_IDs from rides
    const rideBookings = await Ride.find({}, 'Booking_ID');
    const rideBookingIds = new Set(rideBookings.map(ride => ride.Booking_ID.toString()));

    // Filter out bookings that already exist in Ride collection
    const unmatchedBookings = bookings.filter(booking => !rideBookingIds.has(booking._id.toString()));

    res.status(200).json({ success: true, data: unmatchedBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});
// ✅ Direct API: Get bookings for a user
app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const bookings = await Booking.find({ userid: userId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.put('/api/bookings/cancel/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
 

// server.js or routes/user.js
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Excludes password
    // console.log(users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.get('/admin/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
  
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




app.get('/truck-partners', async (req, res) => {
  try {
    const partners = await TruckPartner.find(); // optional: add `.lean()` for performance
    res.status(200).json(partners);
  } catch (err) {
    console.error('Error fetching truck partners:', err.message);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});




app.get('/admin/rides', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});






app.get('/admin/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




app.get('/admin/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API route
app.use('/api/contact', contactRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
