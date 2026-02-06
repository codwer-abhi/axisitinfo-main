const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {register,verifyOtp,loginController,UserloginController} = require('../Controllers/user-controler');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('hotelName').notEmpty().withMessage('Hotel Name is required'),
    body('name').notEmpty().withMessage('Full Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('rooms').optional().isNumeric().withMessage('Rooms must be a number'),
  ],
    register
);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);
router.post('/loginowner',loginController);
router.post("/login", UserloginController);
module.exports = router;
