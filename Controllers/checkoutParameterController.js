const CheckoutParameter = require("../Models/CheckoutParameter");
const Registereduser = require("../Models/User");

// ✅ CREATE or UPDATE
const saveCheckoutParameter = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId=req.userId
    // 🔎 Find hotel
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔁 One record per hotel
    let params = await CheckoutParameter.findOne({
      hotelId: hotel._id,
      userId
    });

    if (params) {
      // 🔄 UPDATE
      Object.assign(params, req.body);
      params.updatedBy = req.userId;   // 🟡 audit (optional)
      await params.save();

      return res.status(200).json({
        message: "Checkout Parameters updated successfully",
        data: params
      });
    }

    // ➕ CREATE
    const newParams = new CheckoutParameter({
      hotelId: hotel._id,
      createdBy: req.userId,           // 🟡 audit
      ...req.body
    });

    await newParams.save();

    res.status(201).json({
      message: "Checkout Parameters created successfully",
      data: newParams
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error
    });
  }
};


const getCheckoutParameter = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const params = await CheckoutParameter.findOne({
      hotelId: hotel._id
    });

    res.status(200).json({
      message: "Checkout Parameters Loaded",
      data: params || {}
    });

  } catch (error) {
    res.status(500).json({
      message: "Error loading data",
      error
    });
  }
};


module.exports = { saveCheckoutParameter, getCheckoutParameter };
