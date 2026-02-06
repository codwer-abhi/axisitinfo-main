const Item = require("../Models/Item");
const Registereduser = require("../Models/User");

/* ================= CREATE ================= */
const createItem = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const { itemName, barcode, hsnCode } = req.body;

    if (!itemName) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const item = await Item.create({
      hotelId: hotel._id,
      hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",
      itemName,
      barcode,
      hsnCode,
      itemImage: req.file ? req.file.path : null
    });

    res.status(201).json({
      message: "Item created successfully",
      data: item
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create item",
      error
    });
  }
};

/* ================= LIST ================= */
const getItems = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await Item.find({ hotelId: hotel._id })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Item list",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch items",
      error
    });
  }
};

/* ================= UPDATE ================= */
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updateData = {
      ...req.body
    };

  if (req.file) {
  updateData.itemImage = req.file.path;
}


    const updated = await Item.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      updateData,
      { new: true }
    ).populate("createdBy", "username");

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update item",
      error
    });
  }
};

/* ================= DELETE ================= */
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await Item.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete item",
      error
    });
  }
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem
};
