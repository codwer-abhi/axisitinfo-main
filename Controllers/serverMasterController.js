const ServerMaster = require("../Models/ServerMaster");
const Registereduser = require("../Models/User");

/* ================= CREATE ================= */
const createServer = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const { name, active } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Server name is required" });
    }

    /* 🔐 Hotel validation */
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    /* 🔁 Duplicate check */
    const exists = await ServerMaster.findOne({
      hotelId: hotel._id,
      name: name.trim()
    });

    if (exists) {
      return res.status(409).json({
        message: "Server already exists"
      });
    }

    const server = await ServerMaster.create({
      hotelId: hotel._id,
      hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",
      name: name.trim(),
      active
    });

    res.status(201).json({
      message: "Server created successfully",
      data: server
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create server",
      error
    });
  }
};

/* ================= LIST ================= */
const getServers = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await ServerMaster.find({
      hotelId: hotel._id
    })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Server list",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch server list",
      error
    });
  }
};

/* ================= UPDATE ================= */
const updateServer = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const { name, active } = req.body;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await ServerMaster.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      { name, active },
      { new: true }
    ).populate("createdBy", "username");

    if (!updated) {
      return res.status(404).json({
        message: "Server not found"
      });
    }

    res.status(200).json({
      message: "Server updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update server",
      error
    });
  }
};

/* ================= DELETE ================= */
const deleteServer = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await ServerMaster.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Server not found"
      });
    }

    res.status(200).json({
      message: "Server deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete server",
      error
    });
  }
};

module.exports = {
  createServer,
  getServers,
  updateServer,
  deleteServer
};
