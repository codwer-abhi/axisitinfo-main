const Instruction = require("../Models/Instruction.js");
const Registereduser = require("../Models/User.js");

// ✅ CREATE or UPDATE Instructions (HOTEL WISE)
const saveInstructions = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    // 🔥 hotelCode → hotelId
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code. Hotel not found.",
      });
    }

    // ⭐ One instruction record per hotel
    let existing = await Instruction.findOne({
      hotelId: hotel._id,
      userId:req.userId
    });

    if (existing) {
      Object.assign(existing, req.body);
      existing.updatedBy = req.userId;   // 🟡 optional audit
      await existing.save();

      return res.status(200).json({
        message: "Instructions updated successfully",
        data: existing,
      });
    }

    // CREATE
    const newInstructions = new Instruction({
      hotelId: hotel._id,          // 🔥 HOTEL LEVEL
      createdBy: req.userId,       // 🟡 optional audit
      ...req.body,
    });

    await newInstructions.save();

    res.status(201).json({
      message: "Instructions saved successfully",
      data: newInstructions,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while saving instructions",
      error,
    });
  }
};


const getInstructions = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code. Hotel not found.",
      });
    }

    const data = await Instruction.findOne({
      hotelId: hotel._id          // 🔥 ONLY hotel filter
    });

    res.status(200).json({
      message: "Instructions fetched successfully",
      data: data || {},
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Instructions",
      error,
    });
  }
};

 module.exports = { saveInstructions, getInstructions };