const UserPermission = require("../Models/UserPermission");
const Registereduser = require("../Models/User");
const UserMaster = require("../Models/UserMaster");

// ================= SAVE / UPDATE PERMISSION =================
const saveUserPermission = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const ownerId = req.userId;

    // 🔐 hotel validation
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const {
      userMasterId,
      firmName,
      section,
      screenName,
      permissions
    } = req.body;

    // 🔁 upsert (same user + section + screen → update)
    const permission = await UserPermission.findOneAndUpdate(
      {
        hotelId: hotel._id,
        userMasterId,
        section,
        screenName
      },
      {
        hotelId: hotel._id,
        userMasterId,
        firmName,
        section,
        screenName,
        permissions,
        createdBy: ownerId
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Permission saved successfully",
      data: permission
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save permission",
      error
    });
  }
};

// ================= GET PERMISSIONS (HOTEL FILTERED) =================
// ================= GET PERMISSIONS (USER + SECTION BASED) =================
const getUserPermissions = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { userMasterId, section } = req.query;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔍 FILTER BY USER + SECTION
    const filter = {
      hotelId: hotel._id
    };

    if (userMasterId) filter.userMasterId = userMasterId;
    if (section) filter.section = section;

    const permissions = await UserPermission.find(filter);

    res.status(200).json({
      message: "User permissions fetched",
      data: permissions
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch permissions",
      error
    });
  }
};


// ================= USER DROPDOWN (HOTEL BASED) =================
const getUsersForPermission = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const users = await UserMaster.find({
      hotelId: hotel._id
    }).select("_id username");

    res.status(200).json({
      message: "Users list",
      data: users
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error
    });
  }
};

module.exports = {
  saveUserPermission,
  getUserPermissions,
  getUsersForPermission
};
