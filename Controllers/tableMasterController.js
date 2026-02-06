const TableMaster = require("../Models/TableMaster");
const Registereduser = require("../Models/User");
const Outlet = require("../Models/Outlet");

/* ================= CREATE ================= */
const createTable = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const { outletId, tableName, tableCode, activeYN } = req.body;

    if (!outletId || !tableName || !tableCode) {
      return res.status(400).json({
        message: "Outlet, Table Name & Table Code are required"
      });
    }

    /* 🔐 Hotel validation */
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    /* 🔐 Outlet validation */
    const outlet = await Outlet.findOne({
      _id: outletId,
      hotelId: hotel._id
    });

    if (!outlet) {
      return res.status(404).json({
        message: "Invalid Outlet"
      });
    }

    /* 🔐 Duplicate table check (same outlet) */
    const exists = await TableMaster.findOne({
      hotelId: hotel._id,
      outletId,
      tableCode
    });

    if (exists) {
      return res.status(409).json({
        message: "Table code already exists for this outlet"
      });
    }

    const table = await TableMaster.create({
      hotelId: hotel._id,
      hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",
      outletId,
      tableName,
      tableCode,
      activeYN
    });

    res.status(201).json({
      message: "Table created successfully",
      data: table
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create table",
      error
    });
  }
};

/* ================= LIST ================= */
const getTables = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await TableMaster.find({
      hotelId: hotel._id
    })
      .populate("outletId", "outletName shortName outletNature")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Table master list",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tables",
      error
    });
  }
};

/* ================= UPDATE ================= */
const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    /* 🔐 Outlet validation if updated */
    if (req.body.outletId) {
      const outlet = await Outlet.findOne({
        _id: req.body.outletId,
        hotelId: hotel._id
      });

      if (!outlet) {
        return res.status(404).json({
          message: "Invalid Outlet"
        });
      }
    }

    const updated = await TableMaster.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    )
      .populate("outletId", "outletName shortName outletNature")
      .populate("createdBy", "username");

    if (!updated) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({
      message: "Table updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update table",
      error
    });
  }
};

/* ================= DELETE ================= */
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await TableMaster.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({
      message: "Table deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete table",
      error
    });
  }
};

module.exports = {
  createTable,
  getTables,
  updateTable,
  deleteTable
};
