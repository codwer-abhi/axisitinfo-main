const PostingParameter = require("../Models/PostingParameter");
const Registereduser = require("../Models/User");

// ⭐ Create / Update Posting Parameters (HOTEL WISE)
const savePostingParameter = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    // 🔥 hotelCode → hotelId
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // ⭐ One posting parameter per hotel
    let params = await PostingParameter.findOne({
      hotelId: hotel._id
    });

    if (params) {
      Object.assign(params, req.body);
      await params.save();
    } else {
      params = await PostingParameter.create({
        hotelId: hotel._id,        // 🔥 HOTEL LEVEL
        userId: req.userId,     // 🟡 optional (audit)
        ...req.body
      });
    }

    res.status(200).json({
      message: "Posting parameters saved successfully",
      data: params
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error
    });
  }
};


const getPostingParameter = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const params = await PostingParameter.findOne({
      hotelId: hotel._id        // 🔥 ONLY hotel filter
    });

    res.status(200).json({
      message: "Posting parameters loaded successfully",
      data: params
    });

  } catch (error) {
    res.status(500).json({
      message: "Error loading data",
      error
    });
  }
};


module.exports = { savePostingParameter, getPostingParameter };
