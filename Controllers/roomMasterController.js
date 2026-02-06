const RoomMaster = require("../Models/RoomMaster.js");
const Registereduser = require("../Models/User.js");

const createRoom = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code. Hotel not found.",
      });
    }

    const {
      roomNo,
      roomName,
      roomCategory,
      chargeMaster,
      multiplePerson,
      houseKeeping,
      status,
      rates
    } = req.body;

    const photo = req.file ? req.file.path : null;

    const newRoom = await RoomMaster.create({
      roomNo,
      roomName,
      roomCategory,
      chargeMaster,
      multiplePerson,
      houseKeeping,
      status,
      photo,
      rates: JSON.parse(rates),
      hotelId: hotel._id,     // 🔥 HOTEL LEVEL
      userId: req.userId  // 🟡 optional (audit)
    });

    res.status(201).json({
      message: "Room created successfully",
      data: newRoom,
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating room", error });
  }
};


const getRooms = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code",
      });
    }

    const rooms = await RoomMaster.find({
      hotelId: hotel._id      // 🔥 ONLY hotel filter
    }).populate("roomCategory");

    res.status(200).json({
      message: "Room Records",
      data: rooms,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching room data", error });
  }
};


const updateRoom = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updateData = { ...req.body };

    if (req.file) updateData.photo = req.file.path;
    if (updateData.rates) updateData.rates = JSON.parse(updateData.rates);

    const room = await RoomMaster.findOneAndUpdate(
      {
        _id: req.params.id,
        hotelId: hotel._id     // 🔥 hotel wise update
      },
      updateData,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);

  } catch (error) {
    res.status(500).json({ message: "Error updating room", error });
  }
};


const deleteRoom = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await RoomMaster.findOneAndDelete({
      _id: req.params.id,
      hotelId: hotel._id      // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error });
  }
};


module.exports = {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom
};
