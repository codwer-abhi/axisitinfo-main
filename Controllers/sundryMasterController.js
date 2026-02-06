const SundryMaster = require("../Models/SundryMaster");
const Registereduser = require("../Models/User");

// CREATE
const createSundry = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const { sundryName, nature, calcSign } = req.body;

    const exists = await SundryMaster.findOne({
      hotelId: hotel._id,
      sundryName
    });

    if (exists) {
      return res.status(400).json({
        message: "Sundry already exists"
      });
    }

    const sundry = new SundryMaster({
      hotelId: hotel._id,
      createdBy: userId,
      sundryName,
      nature,
      calcSign
    });

    await sundry.save();

    res.status(201).json({
      message: "Sundry created successfully",
      data: sundry
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create sundry",
      error
    });
  }
};
const getSundryList = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const sundries = await SundryMaster.find({
      hotelId: hotel._id,
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Sundry list fetched",
      data: sundries
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sundry list",
      error
    });
  }
};
const updateSundry = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const sundry = await SundryMaster.findOne({
      _id: id,
      hotelId: hotel._id
    });

    if (!sundry) {
      return res.status(404).json({ message: "Sundry not found" });
    }

    const { sundryName, nature, calcSign } = req.body;

    sundry.sundryName = sundryName;
    sundry.nature = nature;
    sundry.calcSign = calcSign;

    await sundry.save();

    res.status(200).json({
      message: "Sundry updated successfully",
      data: sundry
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update sundry",
      error
    });
  }
};
const deleteSundry = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const sundry = await SundryMaster.findOne({
      _id: id,
      hotelId: hotel._id
    });

    if (!sundry) {
      return res.status(404).json({ message: "Sundry not found" });
    }

    sundry.isActive = false;
    await sundry.save();

    res.status(200).json({
      message: "Sundry deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete sundry",
      error
    });
  }
};
module.exports={
    createSundry,
    getSundryList,
    updateSundry,
    deleteSundry
}