const GeneralParameter = require("../Models/generalParameter.js");
const Registereduser = require("../Models/User.js");

// ✅ CREATE or UPDATE (HOTEL LEVEL)
const saveGeneralParameters = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    // 🔎 Find hotel
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔁 Check existing hotel record
    let params = await GeneralParameter.findOne({
      hotelId: hotel._id
    });

    if (params) {
      // 🔄 UPDATE
      Object.assign(params, req.body);
      params.updatedBy = req.userId;   // 🟡 audit (optional)

      await params.save();

      return res.status(200).json({
        message: "General Parameters updated successfully",
        data: params
      });
    }

    // ➕ CREATE (first time)
    const newParams = new GeneralParameter({
      hotelId: hotel._id,
      createdBy: req.userId,           // 🟡 audit
      ...req.body
    });

    await newParams.save();

    res.status(201).json({
      message: "General Parameters created successfully",
      data: newParams
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error
    });
  }
};

const getGeneralParameters = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const data = await GeneralParameter.findOne({
      hotelId: hotel._id
    });

    res.status(200).json({
      message: "General Parameters fetched successfully",
      data: data || {}   // 🟢 empty object safe
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch data",
      error
    });
  }
};

module.exports = {
  saveGeneralParameters,
  getGeneralParameters
};
