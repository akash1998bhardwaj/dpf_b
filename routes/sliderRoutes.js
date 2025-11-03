const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const authMiddleware = require('../middleware/auth'); // for protected admin routes

/**
 * @swagger
 * tags:
 *   name: Sliders
 *   description: API for managing homepage sliders
 */

/**
 * @swagger
 * /slider:
 *   post:
 *     summary: Create a new slider (Admin only)
 *     tags: [Sliders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - imageUrl
 *             properties:
 *               title:
 *                 type: string
 *                 example: Summer Sale
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/slider1.jpg
 *               category:
 *                 type: string
 *                 enum: [free, silver, gold, premium]
 *                 default: free
 *               description:
 *                 type: string
 *                 example: Up to 50% off
 *               settings:
 *                 type: object
 *                 properties:
 *                   autoplay:
 *                     type: boolean
 *                     example: true
 *                   delay:
 *                     type: number
 *                     example: 3000
 *                   loop:
 *                     type: boolean
 *                     example: true
 *                   spaceBetween:
 *                     type: number
 *                     example: 10
 *                   slidesPerView:
 *                     type: string
 *                     example: 1
 *                   stopOnHover:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       201:
 *         description: Slider created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, sliderController.createSlider);

/**
 * @swagger
 * /slider:
 *   get:
 *     summary: Get all sliders
 *     tags: [Sliders]
 *     responses:
 *       200:
 *         description: List of sliders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 sliders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       category:
 *                         type: string
 *                       description:
 *                         type: string
 *                       settings:
 *                         type: object
 *                         properties:
 *                           autoplay:
 *                             type: boolean
 *                           delay:
 *                             type: number
 *                           loop:
 *                             type: boolean
 *                           spaceBetween:
 *                             type: number
 *                           slidesPerView:
 *                             type: string
 *                           stopOnHover:
 *                             type: boolean
 *                       active:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get('/', authMiddleware, sliderController.getAllSliders);

/**
 * @swagger
 * /slider/user:
 *   get:
 *     summary: Get sliders available for the logged-in user's subscription plan
 *     tags: [Sliders]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Returns only those sliders which match the user's subscription type.  
 *       - **free** → sees only free sliders  
 *       - **silver** → sees free + silver sliders  
 *       - **gold** → sees free + silver + gold sliders  
 *       - **fullAccess** → sees all sliders
 *     responses:
 *       200:
 *         description: Sliders accessible to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sliders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 671f4c7a3e47c19e4f55678a
 *                       title:
 *                         type: string
 *                         example: "Summer Sale Banner"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com/slider.jpg"
 *                       category:
 *                         type: string
 *                         example: "silver"
 *                       description:
 *                         type: string
 *                         example: "Attractive summer offers"
 *                       active:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */

router.get('/user', authMiddleware, sliderController.getSliders);

/**
 * @swagger
 * /slider/{sliderId}:
 *   put:
 *     summary: Update a slider (Admin only)
 *     tags: [Sliders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sliderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Slider ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [free, silver, gold, premium]
 *               description:
 *                 type: string
 *               settings:
 *                 type: object
 *                 properties:
 *                   autoplay:
 *                     type: boolean
 *                   delay:
 *                     type: number
 *                   loop:
 *                     type: boolean
 *                   spaceBetween:
 *                     type: number
 *                   slidesPerView:
 *                     type: string
 *                   stopOnHover:
 *                     type: boolean
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Slider updated successfully
 *       404:
 *         description: Slider not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:sliderId', authMiddleware, sliderController.updateSlider);

/**
 * @swagger
 * /slider/{sliderId}:
 *   delete:
 *     summary: Soft delete a slider (Admin only)
 *     tags: [Sliders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sliderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Slider ID
 *     responses:
 *       200:
 *         description: Slider deleted successfully
 *       404:
 *         description: Slider not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:sliderId', authMiddleware, sliderController.deleteSlider);

module.exports = router;
