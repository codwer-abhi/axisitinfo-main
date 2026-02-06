const GuestStatus = require("../Models/GuestStatus.js");
const Registereduser = require("../Models/User.js");

// ⭐ Create Guest Status
const createGuestStatus = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const newStatus = new GuestStatus({
      hotelId: hotel._id,        // 🔥 HOTEL LEVEL
      name: req.body.name,
      defined: "System",
      userId: req.userId      // 🟡 optional audit
    });

    await newStatus.save();

    res.status(201).json({
      message: "Guest status created successfully",
      data: newStatus
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating guest status", error });
  }
};



const getGuestStatus = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const statuses = await GuestStatus.find({
      hotelId: hotel._id          // 🔥 ONLY hotel filter
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Guest status list",
      data: statuses
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch guest status", error });
  }
};

const updateGuestStatus = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await GuestStatus.findOneAndUpdate(
      {
        _id: id,
        hotelId: hotel._id        // 🔥 hotel wise update
      },
      {
        name: req.body.name,
        updatedBy: req.userId     // 🟡 optional audit
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Guest status not found" });
    }

    res.status(200).json({
      message: "Guest status updated",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};



const deleteGuestStatus = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await GuestStatus.findOneAndDelete({
      _id: id,
      hotelId: hotel._id          // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Guest status not found" });
    }

    res.status(200).json({ message: "Guest status deleted" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};


module.exports = {
  createGuestStatus,
  getGuestStatus,
  updateGuestStatus,
  deleteGuestStatus
};