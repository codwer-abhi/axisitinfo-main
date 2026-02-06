const RoomCategory = require("../Models/RoomCategory.js");
const Registereduser = require("../Models/User.js");

// ⭐ Create Room Category
const createRoomCategory = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const body = req.body;
    const imageUrls = req.files ? req.files.map(f => f.path) : [];

    const newCategory = new RoomCategory({
      ...body,
      hotelId: hotel._id,          // 🔥 HOTEL LEVEL
      userId: req.userId,       // 🟡 optional (owner/staff)
      images: imageUrls,
      rates: JSON.parse(body.rates)
    });

    await newCategory.save();

    res.status(201).json({
      message: "Room Category Created Successfully",
      data: newCategory
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating room category", error });
  }
};



const getRoomCategories = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const data = await RoomCategory.find({
      hotelId: hotel._id          // 🔥 ONLY hotel filter
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Room Category List Fetched",
      data
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};


const updateRoomCategory = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const body = req.body;
    const imageUrls = req.files ? req.files.map(f => f.path) : [];

    let rates;
    if (body.rates) {
      try {
        rates = JSON.parse(body.rates);
      } catch (e) {
        return res.status(400).json({ message: "Invalid rates JSON" });
      }
    }

    const updatedData = {
      ...body,
      ...(rates && { rates }),
      ...(imageUrls.length > 0 && { images: imageUrls })
    };

    const updated = await RoomCategory.findOneAndUpdate(
      {
        _id: req.params.id,
        hotelId: hotel._id         // 🔥 hotel wise update
      },
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Room Category not found" });
    }

    res.status(200).json({
      message: "Category Updated",
      data: updated,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating room category", error });
  }
};

const deleteRoomCategory = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await RoomCategory.findOneAndDelete({
      _id: req.params.id,
      hotelId: hotel._id           // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category Deleted"
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting", error });
  }
};



module.exports = { getRoomCategories };

module.exports = {
  createRoomCategory,
  getRoomCategories,
  updateRoomCategory,
  deleteRoomCategory,
};