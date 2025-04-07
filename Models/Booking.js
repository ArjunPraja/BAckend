const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
  htype: { type: String, maxLength: 40, required: false },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bname: { type: String, maxLength: 40, required: true },
  movefrom: { type: String, maxLength: 40, required: true },
  moveto: { type: String, maxLength: 40, required: true },
  state: { type: String, maxLength: 40, required: true },
  zipcode: { type: Number, required: true },
  price: { type: Number, required: true },
  razorpay_order_id: { type: String, maxLength: 100, required: false },
  razorpay_payment_id: { type: String, maxLength: 100, required: false },
  status: {
    type: String,
    enum: ['house-type', 'Booking', 'payment-status', 'on-the-way', 'cancel', 'finish'],
    default: 'Booking',
  },
  statuscheck: { type: Boolean, default: false },

  house_type_active: { type: Boolean, default: false },
  booking_active: { type: Boolean, default: false },
  payment_status_active: { type: Boolean, default: false },
  on_the_way_active: { type: Boolean, default: false },
  cancel_active: { type: Boolean, default: false },
  finish_active: { type: Boolean, default: false },
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);


const bookingValidationSchema = Joi.object({
  htype: Joi.string().max(40).optional(),
  userid: Joi.string().hex().length(24).required(), // assuming 'User' has an ObjectId
  bname: Joi.string().max(40).required(),
  movefrom: Joi.string().max(40).required(),
  moveto: Joi.string().max(40).required(),
  state: Joi.string().max(40).required(),
  zipcode: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  razorpay_order_id: Joi.string().max(100).optional().allow(null, ''),
  razorpay_payment_id: Joi.string().max(100).optional().allow(null, ''),
  status: Joi.string().valid('house-type', 'Booking', 'payment-status', 'on-the-way', 'cancel', 'finish').default('Booking'),
  statuscheck: Joi.boolean().default(false),
  
  house_type_active: Joi.boolean().default(false),
  booking_active: Joi.boolean().default(false),
  payment_status_active: Joi.boolean().default(false),
  on_the_way_active: Joi.boolean().default(false),
  cancel_active: Joi.boolean().default(false),
  finish_active: Joi.boolean().default(false),
});

const validateBooking = (data) => {
  return bookingValidationSchema.validate(data);
};

module.exports = { Booking, validateBooking };
