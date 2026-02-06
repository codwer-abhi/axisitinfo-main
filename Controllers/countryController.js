const Country = require("../Models/Country");
const Registereduser = require("../Models/User");

// ================= CREATE =================
const createCountry = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;
console.log(userId);

    const { countryName, countryCode, nationality } = req.body;

    if (!countryName || !countryCode || !nationality) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 🔐 Hotel validation
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🚫 Duplicate check
    const exists = await Country.findOne({
      hotelId: hotel._id,
      countryCode
    });

    if (exists) {
      return res.status(409).json({
        message: "Country already exists"
      });
    }

    const country = await Country.create({
      hotelId: hotel._id,
      createdBy: userId,
      hotelCode:hotelCode,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",
      countryName,
      countryCode,
      nationality
    });
console.log(country);

    res.status(201).json({
      message: "Country created successfully",
      data: country
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create country",
      error
    });
  }
};
// ================= LIST =================
const getCountries = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const countries = await Country.find({
      hotelId: hotel._id
    })
      .populate("createdBy", "username")
      .sort({ countryName: 1 });

    res.status(200).json({
      message: "Country list",
      data: countries
    });
console.log(countries);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch countries",
      error
    });
  }
};
// ================= UPDATE =================
const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await Country.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).json({
      message: "Country updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update country",
      error
    });
  }
};
// ================= DELETE =================
const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await Country.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.status(200).json({
      message: "Country deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete country",
      error
    });
  }
};
module.exports={
    createCountry,
    getCountries,
    updateCountry,
    deleteCountry
}