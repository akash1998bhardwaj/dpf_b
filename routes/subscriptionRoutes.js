const express = require("express");
const router = express.Router();
const { updateSubscription } = require("../controllers/subscriptionController");

// Example: POST /api/subscription/update
router.post("/update", updateSubscription);

module.exports = router;
