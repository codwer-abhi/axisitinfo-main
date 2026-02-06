const MenuCategory = require("../Models/MenuCategory");
const Registereduser = require("../Models/User");
const Outlet = require("../Models/Outlet");

/* ================= CREATE ================= */
const createMenuCategory = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const {
      outletId,
      categoryName,
      categoryType,
      departType,
      accountId,
      taxStructureId
    } = req.body;

    if (!outletId || !categoryName || !departType || !accountId) {
      return res.status(400).json({
        message: "Required fields missing"
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

    const category = await MenuCategory.create({
      hotelId: hotel._id,
      hotelCode,
      outletId,
      categoryName,
      categoryType,
      departType,
      accountId,
      taxStructureId,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster"
    });

    res.status(201).json({
      message: "Menu category created successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create menu category",
      error
    });
  }
};

/* ================= LIST ================= */
const getMenuCategories = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await MenuCategory.find({
      hotelId: hotel._id
    })
      .populate("outletId", "outletName shortName")
      .populate("accountId", "accountName")
      .populate("taxStructureId", "taxName")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Menu category list",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch menu categories",
      error
    });
  }
};

/* ================= UPDATE ================= */
const updateMenuCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await MenuCategory.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    )
      .populate("outletId", "outletName shortName")
      .populate("accountId", "accountName")
      .populate("taxStructureId", "taxName");

    if (!updated) {
      return res.status(404).json({
        message: "Menu category not found"
      });
    }

    res.status(200).json({
      message: "Menu category updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update menu category",
      error
    });
  }
};

/* ================= DELETE ================= */
const deleteMenuCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await MenuCategory.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Menu category not found"
      });
    }

    res.status(200).json({
      message: "Menu category deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete menu category",
      error
    });
  }
};

module.exports = {
  createMenuCategory,
  getMenuCategories,
  updateMenuCategory,
  deleteMenuCategory
};
