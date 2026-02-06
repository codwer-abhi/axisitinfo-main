const jwt = require("jsonwebtoken");
const User = require("../Models/auth-model");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 🔐 Token payload validation
    if (!decoded || !decoded.userid) {
      return res.status(401).json({
        message: "Invalid token payload"
      });
    }

    // 👑 Fetch admin from DB
    const admin = await User.findById(decoded.userid).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found"
      });
    }

    // ❌ Not an admin
    if (!admin.isAdmin) {
      return res.status(403).json({
        message: "Access denied. Admins only."
      });
    }

    // ✅ Attach to request
    req.user = admin;
    req.userId = admin._id;
    req.isAdmin = true;

    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Admin authentication failed"
    });
  }
};

module.exports = adminAuthMiddleware;
