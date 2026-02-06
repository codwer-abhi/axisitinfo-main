const ItemGroup = require("../Models/ItemGroup");
const Registereduser = require("../Models/User");
const Outlet = require("../Models/Outlet");

/* ================= CREATE ================= */
const createItemGroup = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const { outletId, groupName, activeYN } = req.body;

    if (!outletId || !groupName) {
      return res.status(400).json({
        message: "Outlet & Item Group name are required"
      });
    }

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const outlet = await Outlet.findOne({
      _id: outletId,
      hotelId: hotel._id
    });

    if (!outlet) {
      return res.status(404).json({ message: "Invalid Outlet" });
    }

    const exists = await ItemGroup.findOne({
      hotelId: hotel._id,
      outletId,
      groupName
    });

    if (exists) {
      return res.status(409).json({
        message: "Item Group already exists for this outlet"
      });
    }

    const group = await ItemGroup.create({
      hotelId: hotel._id,
      hotelCode,
      outletId,
      groupName,
      activeYN: activeYN || "Y",
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster"
    });

    res.status(201).json({
      message: "Item Group created successfully",
      data: group
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create item group",
      error
    });
  }
};

/* ================= LIST ================= */
const getItemGroups = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await ItemGroup.find({
      hotelId: hotel._id
    })
      .populate("outletId", "outletName shortName outletNature")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Item Group list",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch item groups",
      error
    });
  }
};

/* ================= UPDATE ================= */
const updateItemGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    if (req.body.outletId) {
      const outlet = await Outlet.findOne({
        _id: req.body.outletId,
        hotelId: hotel._id
      });

      if (!outlet) {
        return res.status(404).json({ message: "Invalid Outlet" });
      }
    }

    const updated = await ItemGroup.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    )
      .populate("outletId", "outletName shortName outletNature")
      .populate("createdBy", "username");

    if (!updated) {
      return res.status(404).json({ message: "Item Group not found" });
    }

    res.status(200).json({
      message: "Item Group updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update item group",
      error
    });
  }
};

/* ================= DELETE ================= */
const deleteItemGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await ItemGroup.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item Group not found" });
    }

    res.status(200).json({
      message: "Item Group deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete item group",
      error
    });
  }
};

module.exports = {
  createItemGroup,
  getItemGroups,
  updateItemGroup,
  deleteItemGroup
};
