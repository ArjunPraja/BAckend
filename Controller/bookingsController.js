const { Booking, validateBooking } = require('../Models/Booking');
const razorpay = require('../Conf/razorpay');

exports.createOrder = async (req, res) => {
  try {
    const { error } = validateBooking(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const options = {
      amount: req.body.price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`
    };

    const order = await razorpay.orders.create(options);

    const bookingData = new Booking({
      ...req.body,
      razorpay_order_id: order.id
    });

    const savedBooking = await bookingData.save();

    res.status(200).json({ message: 'Order created', order, booking: savedBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      userid,
    } = req.body;

    const booking = await Booking.findOne({ razorpay_order_id, userid });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.razorpay_payment_id = razorpay_payment_id;
    booking.status = 'payment-status';
    booking.statuscheck = true;
    booking.payment_status_active = true;

    await booking.save();

    res.status(200).json({ message: "Booking confirmed", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking confirmation failed" });
  }
};
