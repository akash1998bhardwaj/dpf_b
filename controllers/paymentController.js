const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", userId, plan } = req.body;

    // ✅ Plan-Amount mapping
    const planAmount = { silver: 299, gold: 499, fullAccess: 999 };

    // ✅ Validate plan
    if (!planAmount[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    // ✅ Validate amount
    if (amount !== planAmount[plan]) {
      return res.status(400).json({ message: "Invalid amount for the selected plan" });
    }

    const options = {
      amount: amount * 100, // paisa
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Verify payment webhook / success
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, plan } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment verified ✅
      await User.findByIdAndUpdate(userId, { subscriptionType: plan });
      res.json({ message: "Payment verified and subscription updated!" });
    } else {
      res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
