// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  truckpartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TruckPartner',
    required: true
  },
  account_holder_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  ifsc_code: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  rides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }]
});

module.exports = mongoose.model('Transaction', transactionSchema);
