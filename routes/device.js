const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management routes
 */

/**
 * @swagger
 * /device/add:
 *   post:
 *     summary: Add a new device (Admin only)
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: FRAME12345
 *     responses:
 *       201:
 *         description: Device added successfully
 *       400:
 *         description: Missing or duplicate deviceId
 *       401:
 *         description: Unauthorized
 */
router.post('/add', authMiddleware, adminMiddleware, deviceController.addDevice);

/**
 * @swagger
 * /device/list:
 *   get:
 *     summary: List all devices (Admin only)
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of devices
 *       401:
 *         description: Unauthorized
 */
router.get('/list', authMiddleware, adminMiddleware, deviceController.listDevices);

/**
 * @swagger
 * /device/{deviceId}/deactivate:
 *   put:
 *     summary: Deactivate a device (Admin only)
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to deactivate
 *     responses:
 *       200:
 *         description: Device deactivated successfully
 *       404:
 *         description: Device not found
 */
router.put('/:deviceId/deactivate', authMiddleware, adminMiddleware, deviceController.deactivateDevice);

/**
 * @swagger
 * /device/{deviceId}:
 *   delete:
 *     summary: Soft delete a device (Admin only)
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to delete
 *     responses:
 *       200:
 *         description: Device deleted successfully
 *       404:
 *         description: Device not found
 */
router.delete('/:deviceId', authMiddleware, adminMiddleware, deviceController.deleteDevice);

/**
 * @swagger
 * /device/activate:
 *   post:
 *     summary: Activate a device (User)
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: FRAME12345
 *               userId:
 *                 type: string
 *                 example: 64c8b2a9f18f83d7d5e6d8a1
 *     responses:
 *       200:
 *         description: Device activated successfully
 *       404:
 *         description: Invalid device ID
 */
router.post('/activate', deviceController.activateDevice);

module.exports = router;
