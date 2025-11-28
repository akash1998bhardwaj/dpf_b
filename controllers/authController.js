const User = require('../models/user');
const { generateOTP } = require('../utils/otp');
const nodemailer = require('nodemailer');
const Device = require('../models/device');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or any email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  });
};

// ✅ Admin Register Controller
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if admin already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Admin Registration Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// ✅ Admin Login Controller
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find admin by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // token valid for 7 days
    );

    // Return response
    res.json({
      message: 'Login successful',
      statusCode: 200,
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Registration/Login (send OTP)
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    if (user.otpExpiresAt < new Date()) return res.status(400).json({ error: 'OTP expired' });

    // OTP verified → clear it
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Verify deviceId and link to user
exports.verifyDeviceId = async (req, res) => {
  try {
    const { deviceId, userId } = req.body;

    // 🔸 Step 1: Validate required fields
    if (!deviceId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'deviceId and userId are required',
      });
    }

    // 🔸 Step 2: Check if device exists in Device collection
    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Invalid deviceId',
      });
    }

    if (!device.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Device is inactive',
      });
    }

    // 🔸 Step 3: Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // 🔸 Step 4: Check if this deviceId is already linked to another user
    const existingDeviceUser = await User.findOne({
      deviceId,
    });


    if (existingDeviceUser) {
      return res.status(200).json({
        success: false,
        message: 'Device ID already linked to another user',
      });
    }

    // 🔸 Step 5: Link the deviceId to the user
    user.deviceId = deviceId;
    await user.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // token valid for 7 days
    );


    // 🔸 Step 6: Success response
    return res.status(200).json({
      success: true,
      message: 'Device verified and linked to user successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Device verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};



// ✅ Optional: Register a new device
exports.registerDevice = async (req, res) => {
  try {
    const { deviceId, user } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required' });
    }

    const existing = await Device.findOne({ deviceId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'deviceId already registered' });
    }

    const newDevice = new Device({ deviceId, user });
    await newDevice.save();

    res.status(201).json({ success: true, message: 'Device registered successfully', newDevice });
  } catch (error) {
    console.error('Device registration error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, deviceId } = req.body;

    // Check for missing fields
    if (!email || !deviceId) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // ✅ Step 1: Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please log in to the app and create an account first.',
      });
    }

    // ✅ Step 2: Check if deviceId exists and matches
    if (user.deviceId !== deviceId) {
      const deviceExists = await User.findOne({ deviceId });

      if (!deviceExists) {
        return res.status(404).json({
          success: false,
          message: 'Device ID not found. Please log in to the app and create an account first.',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Device ID belongs to another user.',
      });
    }
    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // token valid for 7 days
    );

    // Return response
    res.json({
      message: 'Login successful',
      statusCode: 200,
      user: {
        token,
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
