const MenuItem = require("../Models/MenuItem");
const Registereduser = require("../Models/User");
const Outlet = require("../Models/Outlet");

/* ================= CREATE ================= */
const createMenuItem = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const outlet = await Outlet.findOne({
      _id: req.body.outletId,
      hotelId: hotel._id
    });

    if (!outlet) {
      return res.status(404).json({ message: "Invalid Outlet ID" });
    }

    const item = await MenuItem.create({
      ...req.body,
      hotelId: hotel._id,
      hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster"
    });

    res.status(201).json({
      message: "Menu item created successfully",
      data: item
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create menu item",
      error
    });
  }
};

/* ================= LIST ================= */
const getMenuItems = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await MenuItem.find({ hotelId: hotel._id })
      .populate("outletId", "outletName shortName")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Menu item list",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch menu items",
      error
    });
  }
};

/* ================= UPDATE ================= */
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await MenuItem.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update menu item",
      error
    });
  }
};

/* ================= DELETE ================= */
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await MenuItem.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete menu item",
      error
    });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem
};
