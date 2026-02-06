const State = require("../Models/State");
const Registereduser = require("../Models/User");
const Country = require("../Models/Country");

/* ================= CREATE ================= */
const createState = async (req, res) => {
  try {
    const hotelCode = req.hotelId;   // middleware se aa raha
    const userId = req.userId;

    const { stateName, stateCode, countryId } = req.body;

    if (!stateName || !stateCode || !countryId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Validate Hotel
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔹 Validate Country (belongs to same hotel)
    const country = await Country.findOne({
      _id: countryId,
      hotelId: hotel._id
    });

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    // 🔹 Duplicate check
    const exists = await State.findOne({
      hotelId: hotel._id,
      countryId,
      stateCode: stateCode.trim()
    });

    if (exists) {
      return res.status(409).json({ message: "State already exists" });
    }

    const state = await State.create({
      hotelId: hotel._id,
      hotelCode,
      countryId,
      stateName: stateName.trim(),
      stateCode: stateCode.trim(),
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster"
    });

    res.status(201).json({
      message: "State created successfully",
      data: state
    });

  } catch (error) {
    res.status(500).json({
      message: "Create failed",
      error: error.message
    });
  }
};


/* ================= LIST ================= */
const getStates = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const states = await State.find({ hotelId: hotel._id })
      .populate("countryId", "countryName")
      .populate({
        path: "createdBy",
        select: "username name",
        strictPopulate: false
      })
      .sort({ stateName: 1 });

    res.status(200).json({
      message: "State list",
      data: states
    });

  } catch (error) {
    res.status(500).json({
      message: "Fetch failed",
      error: error.message
    });
  }
};


/* ================= UPDATE ================= */
const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await State.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({
      message: "State updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message
    });
  }
};


/* ================= DELETE ================= */
const deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await State.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "State not found" });
    }

    res.status(200).json({ message: "State deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};
module.exports={
    createState,
    getStates,
    updateState,
    deleteState
}