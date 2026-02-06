const City = require("../Models/City");
const Registereduser = require("../Models/User");


// ================= CREATE =================
const createCity = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    let { cityName, state, country, zipCode } = req.body;

    if (!cityName || !state || !country) {
      return res.status(400).json({
        message: "City Name, State & Country required"
      });
    }

    // 🔠 Normalize (important)
    cityName = cityName.toUpperCase().trim();
    state = state.toUpperCase();
    country = country.toUpperCase();

    // 🔐 Hotel validation
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🚫 Duplicate per hotel
    const exists = await City.findOne({
      hotelId: hotel._id,
      cityName,
      state,
      country
    });

    if (exists) {
      return res.status(409).json({
        message: "City already exists"
      });
    }

    const city = await City.create({
      hotelId: hotel._id,
      hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",
      cityName,
      state,
      country,
      zipCode
    });

    res.status(201).json({
      message: "City created successfully",
      data: city
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create city",
      error: error.message
    });
  }
};



// ================= LIST =================
const getCities = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const cities = await City.find({ hotelId: hotel._id })
      .populate("createdBy", "username name")
      .sort({ cityName: 1 });

    res.status(200).json({
      message: "City list",
      data: cities
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cities",
      error: error.message
    });
  }
};



// ================= UPDATE =================
const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    let { cityName, state, country, zipCode } = req.body;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updateData = {};

    if (cityName) updateData.cityName = cityName.toUpperCase().trim();
    if (state) updateData.state = state.toUpperCase();
    if (country) updateData.country = country.toUpperCase();
    if (zipCode !== undefined) updateData.zipCode = zipCode;

    // 🚫 Duplicate check on update
    const duplicate = await City.findOne({
      _id: { $ne: id },
      hotelId: hotel._id,
      cityName: updateData.cityName,
      state: updateData.state,
      country: updateData.country
    });

    if (duplicate) {
      return res.status(409).json({
        message: "City already exists"
      });
    }

    const updated = await City.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({
      message: "City updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update city",
      error: error.message
    });
  }
};



// ================= DELETE =================
const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await City.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "City not found" });
    }

    res.status(200).json({
      message: "City deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete city",
      error: error.message
    });
  }
};


module.exports = {
  createCity,
  getCities,
  updateCity,
  deleteCity
};
