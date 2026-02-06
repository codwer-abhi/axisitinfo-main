const UserPermission = require("../Models/UserPermission");
const Registereduser = require("../Models/User");

const checkPermission = (section, screenName, action) => {
  return async (req, res, next) => {
    try {
      const hotelCode = req.hotelId;
      const userMasterId = req.userId;

      // 🔐 Hotel validate
      const hotel = await Registereduser.findOne({ hotelCode });
      if (!hotel) {
        return res.status(403).json({ message: "Invalid Hotel" });
      }

      /* =================================================
         🔑 OWNER → FULL ACCESS (NO PERMISSION CHECK)
      ================================================= */
      if (req.loginType === "OWNER") {
        return next(); // 🔥 owner ko sab allowed
      }

      /* =================================================
         👤 USER → CHECK PERMISSION
      ================================================= */
      const permission = await UserPermission.findOne({
        hotelId: hotel._id,
        userMasterId,
        section,
        screenName
      });

      if (!permission) {
        return res.status(403).json({
          message: "No permission assigned"
        });
      }

      if (!permission.permissions[action]) {
        return res.status(403).json({
          message: `Access denied for ${action}`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: "Permission middleware failed",
        error: error.message
      });
    }
  };
};

module.exports = { checkPermission };
