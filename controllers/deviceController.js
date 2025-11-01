const Device = require('../models/device');

// ✅ Admin: Add a new Device ID
exports.addDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: 'deviceId is required' });
    }

    const existing = await Device.findOne({ deviceId: deviceId.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Device ID already exists' });
    }

    const device = await Device.create({
      deviceId: deviceId.toUpperCase(),
      addedBy: req.user?._id || null, // admin id (if auth added)
    });

    res.status(201).json({ message: 'Device added successfully', device });
  } catch (error) {
    console.error('Error adding device:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Admin: List all devices
exports.listDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json({ count: devices.length, devices });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ User: Activate a Device (during login)
exports.activateDevice = async (req, res) => {
  try {
    const { deviceId, userId } = req.body;

    if (!deviceId || !userId) {
      return res.status(400).json({ message: 'deviceId and userId required' });
    }

    const device = await Device.findOne({
      deviceId: deviceId.toUpperCase(),
      isDeleted: false,
    });

    if (!device) {
      return res.status(404).json({ message: 'Invalid Device ID' });
    }

    if (device.status === 'active') {
      return res.status(400).json({ message: 'This device is already active with another user' });
    }

    device.status = 'active';
    device.assignedTo = userId;
    device.activatedAt = new Date();
    await device.save();

    res.json({ message: 'Device activated successfully', device });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Admin: Deactivate device
exports.deactivateDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const device = await Device.findOne({
      deviceId: deviceId.toUpperCase(),
      isDeleted: false,
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.status = 'inactive';
    device.deactivatedAt = new Date();
    await device.save();

    res.json({ message: 'Device deactivated successfully', device });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Admin: Soft Delete device
exports.deleteDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const device = await Device.findOne({ deviceId: deviceId.toUpperCase() });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.isDeleted = true;
    device.status = 'deleted';
    await device.save();

    res.json({ message: 'Device deleted successfully', device });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
