const BusinessSource = require("../Models/BusinessSource.js");
const Registereduser = require("../Models/User.js");

// ⭐ Create Business Source
const createBusinessSource = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    // Hotel ObjectId find
    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    const newSource = new BusinessSource({
      hotelId: hotel._id,        // 🔥 hotel level data
      userId: req.userId,     // 🟡 optional (owner/staff)
      name: req.body.name,
      defined: "System",
      active: req.body.active
    });

    await newSource.save();

    res.status(201).json({
      message: "Business source created successfully",
      data: newSource
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating", error });
  }
};


// ⭐ Get All business sources (HOTEL WISE)
const getBusinessSources = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    const sources = await BusinessSource.find({
      hotelId: hotel._id          // 🔥 ONLY hotel filter
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Business sources",
      data: sources
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch", error });
  }
};


// ⭐ Update Business Source
const updateBusinessSource = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await BusinessSource.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        active: req.body.active
      },
      { new: true }
    );

    res.status(200).json({
      message: "Updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};


// ⭐ Delete Business Source
const deleteBusinessSource = async (req, res) => {
  try {
    const { id } = req.params;

    await BusinessSource.findByIdAndDelete(id);

    res.json({
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};

module.exports = {
  createBusinessSource,
  getBusinessSources,
  updateBusinessSource,
  deleteBusinessSource
};
