const express = require('express');
const { uploadFile } = require('../controllers/uploadController');
const upload = require('../middleware/uploadImage');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file to S3
 *     description: Uploads a file to AWS S3 using Multer and Multer-S3
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileUrl:
 *                   type: string
 */
router.post('/upload', authMiddleware, upload.single('image'), uploadFile);

module.exports = router;
