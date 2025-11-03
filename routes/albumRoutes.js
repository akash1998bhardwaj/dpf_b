const express = require('express');
const router = express.Router();
const {
  createAlbum,
  getAllAlbums,
  getAlbum,
  updateAlbum,
  deleteAlbum,
} = require('../controllers/albumController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Albums
 *   description: API endpoints for managing user albums
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Album:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6727a7e8c85b7b3dc0a4b2c1
 *         name:
 *           type: string
 *           example: "My Vacation Album"
 *         userId:
 *           type: string
 *           example: "671aa9e3a19f3dfdc3e2a14f"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isDelete:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /album:
 *   post:
 *     summary: Create a new album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Travel Album"
 *               userId:
 *                 type: string
 *                 example: "671aa9e3a19f3dfdc3e2a14f"
 *     responses:
 *       201:
 *         description: Album created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Album created"
 *                 album:
 *                   $ref: '#/components/schemas/Album'
 *       400:
 *         description: Missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createAlbum);

/**
 * @swagger
 * /album:
 *   get:
 *     summary: Get all albums of the logged-in user
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of albums for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 albums:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Album'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getAllAlbums);

/**
 * @swagger
 * /album/{albumId}:
 *   get:
 *     summary: Get a single album by ID
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Album details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 album:
 *                   $ref: '#/components/schemas/Album'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Album not found
 *       500:
 *         description: Server error
 */
router.get('/:albumId', authMiddleware, getAlbum);

/**
 * @swagger
 * /album/{albumId}:
 *   put:
 *     summary: Update an existing album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Album Name"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Album updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Album updated"
 *                 album:
 *                   $ref: '#/components/schemas/Album'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Album not found
 *       500:
 *         description: Server error
 */
router.put('/:albumId', authMiddleware, updateAlbum);

/**
 * @swagger
 * /album/{albumId}:
 *   delete:
 *     summary: Soft delete an album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Album deleted successfully (soft delete)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Album deleted"
 *                 album:
 *                   $ref: '#/components/schemas/Album'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Album not found
 *       500:
 *         description: Server error
 */
router.delete('/:albumId', authMiddleware, deleteAlbum);

module.exports = router;
