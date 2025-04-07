const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const TruckPartner = require("../Models/TrucPartner");

dotenv.config(); // ✅ Load env vars

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 📦 Create Razorpay Order
router.post("/order", async (req, res) => {
  const { amount, email } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ error: "Amount and email are required" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
    });

    return res.status(200).json({
      order,
      key: process.env.RAZORPAY_KEY_ID, // send key to frontend
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// ✅ Verify Payment & Update DB
router.post("/verify", async (req, res) => {
  const {
    email,
    selectedPackage,
    price,
    vehicle,
    paymentId,
    orderId,
    signature,
  } = req.body;

  if (!email || !selectedPackage || !price || !vehicle || !paymentId || !orderId || !signature) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const updated = await TruckPartner.findOneAndUpdate(
      { t_email: email },
      {
        package_type: selectedPackage,
        price,
        truck_type: vehicle,
        start_date: startDate,
        end_date: endDate,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Payment successful and package updated!",
      updated,
    });
  } catch (error) {
    console.error("Verification failed:", error);
    return res.status(500).json({ message: "Server error during verification" });
  }
});

module.exports = router;
