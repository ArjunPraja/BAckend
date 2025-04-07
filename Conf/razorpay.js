const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_c24H9ZLQiaptXy',          // ✅ In quotes
  key_secret: '1lYb6jpCbe3bNqwX3ZnLF18L',     // ✅ In quotes
});

module.exports = razorpayInstance;
