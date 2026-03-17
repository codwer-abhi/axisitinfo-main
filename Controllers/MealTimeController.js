const MealTime = require("../Models/MealTime");
const Registereduser = require("../Models/User");


// ================= CREATE =================
const createMealTime = async (req, res) => {
  try {

    const hotelCode = req.hotelId;
    const userId = req.userId;

    const { name, fromTime, toTime } = req.body;

    if (!name || !fromTime || !toTime) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 🔐 Hotel validation
    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    // 🚫 Duplicate check
    const exists = await MealTime.findOne({
      hotelId: hotel._id,
      name
    });

    if (exists) {
      return res.status(409).json({
        message: "Meal time already exists"
      });
    }

    const mealTime = await MealTime.create({
      hotelId: hotel._id,
      hotelCode: hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",
      name,
      fromTime,
      toTime
    });

    res.status(201).json({
      message: "Meal time created successfully",
      data: mealTime
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create meal time",
      error
    });

  }
};



// ================= LIST =================
const getMealTimes = async (req, res) => {
  try {

    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    const mealTimes = await MealTime.find({
      hotelId: hotel._id
    })
      .populate("createdBy", "username")
      .sort({ fromTime: 1 });

    res.status(200).json({
      message: "Meal time list",
      data: mealTimes
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch meal times",
      error
    });

  }
};



// ================= UPDATE =================
const updateMealTime = async (req, res) => {
  try {

    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    const updated = await MealTime.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Meal time not found"
      });
    }

    res.status(200).json({
      message: "Meal time updated successfully",
      data: updated
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update meal time",
      error
    });

  }
};



// ================= DELETE =================
const deleteMealTime = async (req, res) => {
  try {

    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    const deleted = await MealTime.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Meal time not found"
      });
    }

    res.status(200).json({
      message: "Meal time deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete meal time",
      error
    });

  }
};


module.exports = {
  createMealTime,
  getMealTimes,
  updateMealTime,
  deleteMealTime
};