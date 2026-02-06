// Controllers/userMaster.controller.js
const UserMaster = require("../Models/UserMaster");
const Registereduser = require("../Models/User");
const bcrypt = require("bcrypt");

// ------------------------ CREATE USER MASTER ------------------------
const createUserMaster = async (req, res) => {
  try {
    const hotelCode = req.hotelId;   // 🔹 JWT se aaya
    const ownerId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const { username, password, isSupervisor, allowBackDate } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserMaster.create({
      hotelId: hotel._id,        // ✅ ObjectId relation
      hotelCode: hotel.hotelCode, // ✅ STRING hotelCode
      username,
      email: hotel.email,
      passwordHash,
      isSupervisor,
      allowBackDate,
      createdBy: ownerId
    });

    res.status(201).json({
      message: "User Master Created Successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to create user master", error });
  }
};


// ------------------------ GET USER MASTER LIST ------------------------
const getUserMasters = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel Code" });

    const users = await UserMaster.find({
      hotelId: hotel._id   // 🔹 hotel filter
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "User Master List",
      data: users
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// ------------------------ TOGGLE USER STATUS ------------------------
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel Code" });

    const user = await UserMaster.findOne({
      _id: userId,
      hotelId: hotel._id    // 🔹 hotel filter
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "Active" ? "Inactive" : "Active";
    await user.save();

    res.status(200).json({
      message: "Status updated",
      status: user.status
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
};

// ------------------------ UPDATE USER MASTER ------------------------
const updateUserMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel Code" });

    const user = await UserMaster.findOne({
      _id: id,
      hotelId: hotel._id   // 🔹 hotel filter
    });

    if (!user) return res.status(404).json({ message: "User Master not found" });

    const { name, isSupervisor, allowBackDate } = req.body;

    // ✅ ONLY ALLOWED FIELDS
    if (name !== undefined) user.name = name;
    if (isSupervisor !== undefined) user.isSupervisor = isSupervisor;
    if (allowBackDate !== undefined) user.allowBackDate = allowBackDate;

    await user.save();

    res.status(200).json({
      message: "User Master Updated Successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to update user master", error });
  }
};

module.exports = {
  createUserMaster,
  getUserMasters,
  toggleUserStatus,
  updateUserMaster
};
