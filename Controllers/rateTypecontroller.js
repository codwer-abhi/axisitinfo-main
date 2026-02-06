const RateType = require("../Models/rateTypemodel.js");
const Registereduser = require("../Models/User.js");

// ⭐ CREATE or UPDATE Rate Type
const saveRateType = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    // 🔥 hotelCode → hotelId
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code. Hotel not found.",
      });
    }

    const hotelId = hotel._id;

    // ⭐ One RateType per hotel
    let existing = await RateType.findOne({ hotelId });

    if (existing) {
      // UPDATE
      existing.rate1 = req.body.rate1;
      existing.rate2 = req.body.rate2;
      existing.rate3 = req.body.rate3;
      existing.rate4 = req.body.rate4;
      existing.rate5 = req.body.rate5;

      await existing.save();

      return res.status(200).json({
        message: "Rate Type updated successfully",
        data: existing,
      });
    }

    // CREATE
    const newRate = new RateType({
      hotelId,                 // 🔥 HOTEL LEVEL
      userId: req.userId,   // 🟡 optional (audit)
      ...req.body,
    });

    await newRate.save();

    res.status(201).json({
      message: "Rate Type created successfully",
      data: newRate,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
const getRateType = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code. Hotel not found.",
      });
    }

    const rateType = await RateType.findOne({
      hotelId: hotel._id     // 🔥 ONLY hotel filter
    });

    res.status(200).json({
      message: "Rate Type fetched successfully",
      data: rateType,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching Rate Type",
      error,
    });
  }
};

module.exports = {
saveRateType,
getRateType
};