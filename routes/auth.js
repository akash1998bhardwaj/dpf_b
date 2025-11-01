const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin registered successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 652c9e9f88a76c25c09c4d2a
 *                     name:
 *                       type: string
 *                       example: Super Admin
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *       400:
 *         description: Validation error or admin already exists
 *       500:
 *         description: Server error
 */
router.post('/register', authController.registerAdmin);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login and token generation
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 652c9e9f88a76c25c09c4d2a
 *                     name:
 *                       type: string
 *                       example: Super Admin
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', authController.adminLogin);


/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to user email
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: akash@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent to your email
 */
router.post('/send-otp', authController.sendOTP);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: akash@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 userId:
 *                   type: string
 *                   example: 64f8d0f7a1234567890abcd
 */
router.post('/verify-otp', authController.verifyOTP);



// POST /api/device/verify
router.post('/verify', authController.verifyDeviceId);

// POST /api/device/register
router.post('/register', authController.registerDevice);

module.exports = router;

