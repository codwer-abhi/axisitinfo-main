const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Registereduser = require('../Models/User');
const BusinessDate = require("../Models/BusinessDate");
const moment = require("moment");
const { sendOTPEmail } = require('../utils/mailer');
const UserMaster = require("../Models/UserMaster");
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit 
};

register = async (req, res, next) => {
  try {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { hotelName, name, email, password, rooms, country, state, phoneCode, phone } = req.body;

    // check existing email
    const existing = await Registereduser.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // generate OTP
    const otp = generateOTP();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    // create user with otp and status pending-email-verification
    const user = new Registereduser({
      hotelName, name, email: email.toLowerCase(), passwordHash,
      rooms, country, state, phoneCode, phone,
      status: 'pending-email-verification',
      otp: { code: otp, expiresAt }
    });

    await user.save();

    // send otp email
    await sendOTPEmail(user.email, otp, user.name);

    return res.status(201).json({
      message: 'Registered. OTP sent to email. Verify OTP to continue.',
      userId: user._id
    });
  } catch (err) {
    next(err);
  }
};

verifyOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ message: 'userId and otp required' });

    const user = await Registereduser.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp || !user.otp.code) return res.status(400).json({ message: 'No OTP found. Please request a new one.' });

    if (new Date() > new Date(user.otp.expiresAt)) {
      return res.status(400).json({ message: 'OTP expired. Please register again or request new OTP.' });
    }

    if (otp !== user.otp.code) return res.status(400).json({ message: 'Invalid OTP' });

    // OTP valid -> update status to pending-admin-approval and clear otp
    user.status = 'pending-admin-approval';
    user.otp = { code: null, expiresAt: null };
    await user.save();

    return res.json({ message: 'OTP verified. Your account is pending admin approval.' });
  } catch (err) {
    next(err);
  }
};
const loginController = async (req, res) => {
  try {
    const { hotelCode, password } = req.body;

    if (!hotelCode || !password) {
      return res.status(400).json({
        message: "Hotel Code & Password required"
      });
    }

    // 🔍 Find hotel
    const user = await Registereduser.findOne({ hotelCode });
    if (!user) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // 🔐 Status checks
    if (user.status === "pending-email-verification") {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    if (user.status === "pending-admin-approval") {
      return res.status(400).json({ message: "Account pending admin approval" });
    }

    if (user.status !== "approved") {
      return res.status(403).json({ message: "Account not approved" });
    }

    // 🔑 Password check
    const passMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    /* ------------------------------------
       🟢 BUSINESS DATE INIT (CORE FIX)
    ------------------------------------ */
    let businessDate = await BusinessDate.findOne({
      hotelId: user._id
    });

    if (!businessDate) {
      businessDate = await BusinessDate.create({
        hotelId: user._id,
        currentDate: moment().format("YYYY-MM-DD"),
        lastAuditDate: null,
        status: "OPEN"
      });
    }

    // 🎟️ JWT
    const token = jwt.sign(
      {
        userId: user._id,
        hotelCode: user.hotelCode
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        hotelName: user.hotelName,
        hotelCode: user.hotelCode
      },
      businessDate: businessDate.currentDate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const UserloginController = async (req, res) => {
  try {
    const { hotelCode, username, password } = req.body;

    if (!hotelCode || !username || !password) {
      return res.status(400).json({
        message: "Hotel Code, Username & Password required"
      });
    }

    /* ------------------------------------
       1️⃣ HOTEL VERIFY
    ------------------------------------ */
    const hotelUser = await Registereduser.findOne({ hotelCode });

    if (!hotelUser) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    if (hotelUser.status !== "approved") {
      return res.status(403).json({
        message: "Hotel account not approved"
      });
    }

    /* ------------------------------------
       2️⃣ STAFF VERIFY
    ------------------------------------ */
    const staffUser = await UserMaster.findOne({
      hotelId: hotelUser._id,
      username,
      status: "Active"
    });

    if (!staffUser) {
      return res.status(404).json({
        message: "Staff user not found or inactive"
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      staffUser.passwordHash
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password"
      });
    }

    /* ------------------------------------
       3️⃣ JWT
    ------------------------------------ */
    const token = jwt.sign(
      {
        hotelId: hotelUser._id,
        hotelCode: hotelUser.hotelCode,
        userMasterId: staffUser._id,
        role: staffUser.isSupervisor ? "SUPERVISOR" : "STAFF"
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userMasterId: staffUser._id,
        name: staffUser.name,
        username: staffUser.username,
        role: staffUser.isSupervisor ? "SUPERVISOR" : "STAFF",
        hotelName: hotelUser.hotelName,
        hotelCode: hotelUser.hotelCode
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





module.exports = {register ,verifyOtp, loginController,UserloginController};