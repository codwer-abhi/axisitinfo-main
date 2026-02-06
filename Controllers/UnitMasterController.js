const UnitMaster = require("../Models/UnitMaster");
const Registereduser = require("../Models/User");


// ================= CREATE =================
const createUnit = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const { unitName, isActive } = req.body;

    if (!unitName) {
      return res.status(400).json({ message: "Unit Name is required" });
    }

    // 🔐 Hotel validation
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🚫 Duplicate check
    const exists = await UnitMaster.findOne({
      hotelId: hotel._id,
      unitName: unitName.toUpperCase()
    });

    if (exists) {
      return res.status(409).json({ message: "Unit already exists" });
    }

    const unit = await UnitMaster.create({
      hotelId: hotel._id,
      hotelCode,
      unitName,
      isActive,
      defined: "User",
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster"
    });

    res.status(201).json({
      message: "Unit created successfully",
      data: unit
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create unit",
      error
    });
  }
};


// ================= LIST =================
const getUnits = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const units = await UnitMaster.find({
      hotelId: hotel._id
    })
      .populate("createdBy", "username")
      .sort({ unitName: 1 });

    res.status(200).json({
      message: "Unit list",
      data: units
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch units",
      error
    });
  }
};


// ================= UPDATE =================
const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await UnitMaster.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({
      message: "Unit updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update unit",
      error
    });
  }
};


// ================= DELETE =================
const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await UnitMaster.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({
      message: "Unit deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete unit",
      error
    });
  }
};


module.exports = {
  createUnit,
  getUnits,
  updateUnit,
  deleteUnit
};
