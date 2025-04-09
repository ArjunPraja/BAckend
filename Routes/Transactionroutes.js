const express = require('express');
const router = express.Router();
const Transactions = require('../Models/Transaction');

router.post('/', async (req, res) => {
    try {
      const newTransaction = new Transactions(req.body);
      const savedTransaction = await newTransaction.save();
      res.status(201).json({ success: true, data: savedTransaction });
    } catch (error) {
      console.error("Transaction save failed:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  router.get('/:partnerId', async (req, res) => {
    try {
      const transactions = await Transactions.find({ truckpartner: req.params.partnerId })
        .populate('truckpartner')  // Optional: Only if you want full partner details
        .populate('rides');        // Optional: Only if rides are stored in each transaction
  
      res.status(200).json({ success: true, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

module.exports = router;
