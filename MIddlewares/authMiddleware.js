const jwt = require("jsonwebtoken");
const Registereduser = require("../Models/User");
const UserMaster = require("../Models/UserMaster");

async function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const jwtToken = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token." });
    }

    /* -------------------------------------------------
       COMMON (DON'T CHANGE EXISTING NAMES)
    ------------------------------------------------- */
    req.token = jwtToken;
    req.hotelId = decoded.hotelCode;   // ✅ SAME as before
    req.userId = decoded.userId;       // default (OWNER)
    req.email = decoded.email;

    /* =================================================
       🔑 OWNER LOGIN (loginController)
    ================================================= */
    if (decoded.userId && !decoded.userMasterId) {
      const owner = await Registereduser.findById(decoded.userId).select("-passwordHash");

      if (!owner) {
        return res.status(401).json({ message: "Owner not found" });
      }

      req.user = owner;                // ✅ SAME
      req.loginType = "OWNER";         // ➕ extra (safe)
      return next();
    }

    /* =================================================
       👤 USER MASTER LOGIN (UserloginController)
    ================================================= */
    if (decoded.userMasterId) {
      const staff = await UserMaster.findById(decoded.userMasterId);

      if (!staff || staff.status !== "Active") {
        return res.status(401).json({ message: "User access inactive" });
      }

      // ⚠️ keep SAME property names
      req.user = staff;                // now user = staff
      req.userId = staff._id;          // overwrite safely
      req.loginType = "USER";

      // ➕ optional helpers
      req.isSupervisor = staff.isSupervisor;
      req.allowBackDate = staff.allowBackDate;
      req.role = decoded.role;

      return next();
    }

    return res.status(401).json({ message: "Invalid token payload" });

  } catch (error) {
    return res.status(401).json({ message: "Token verification failed" });
  }
}

module.exports = authMiddleware;
