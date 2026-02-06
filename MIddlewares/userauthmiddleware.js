// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const Registereduser = require("../Models/User");
const UserMaster = require("../Models/UserMaster");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔐 Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    /* ------------------------------------
       1️⃣ VERIFY HOTEL (Registereduser)
    ------------------------------------ */
    const hotel = await Registereduser.findById(decoded.hotelId);

    if (!hotel || hotel.status !== "approved") {
      return res.status(401).json({
        message: "Hotel access invalid or revoked"
      });
    }

    /* ------------------------------------
       2️⃣ VERIFY USER MASTER (Staff)
    ------------------------------------ */
    const staffUser = await UserMaster.findById(decoded.userMasterId);

    if (!staffUser || staffUser.status !== "Active") {
      return res.status(403).json({
        message: "User access revoked or inactive"
      });
    }

    /* ------------------------------------
       3️⃣ ATTACH CONTEXT TO req
    ------------------------------------ */
    req.token = token;

    // 🔥 SAME PATTERN AS CHECKIN CONTROLLER
    req.hotelId = hotel.hotelCode;     // string (used everywhere)
    req.userId = staffUser._id;        // UserMaster id

    // Optional (useful later)
    req.hotelObjectId = hotel._id;     // Registereduser ObjectId
    req.userRole = decoded.role;       // STAFF / SUPERVISOR
    req.userName = staffUser.name;

    next();

  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({
      message: "Token verification failed"
    });
  }
};

module.exports = authMiddleware;
