const RoomFeature = require("../Models/RoomFeature.js");
const Registereduser = require("../Models/User.js");

const createRoomFeature = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const feature = new RoomFeature({
      hotelId: hotel._id,        // 🔥 hotel level
      userId: req.userId,     // 🟡 optional
      ...req.body,
    });

    await feature.save();

    res.status(201).json({
      message: "Room Feature Created Successfully",
      data: feature,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating room feature", error });
  }
};

const getRoomFeatures = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const features = await RoomFeature.find({
      hotelId: hotel._id          // 🔥 ONLY hotel filter
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Room Features fetched successfully",
      data: features,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching", error });
  }
};

// ⭐ Update Room Feature
const updateRoomFeature = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await RoomFeature.findOneAndUpdate(
      {
        _id: req.params.id,
        hotelId: hotel._id        // 🔥 hotel wise
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Room Feature not found" });
    }

    res.status(200).json({
      message: "Room Feature Updated Successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating", error });
  }
};


const deleteRoomFeature = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await RoomFeature.findOneAndDelete({
      _id: req.params.id,
      hotelId: hotel._id          // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Room Feature not found" });
    }

    res.status(200).json({
      message: "Room Feature Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting", error });
  }
};

module.exports = {
  createRoomFeature,
  getRoomFeatures,
  updateRoomFeature,
  deleteRoomFeature,
};