const BookingSource = require("../Models/BookingSource");
const RegisteredUser = require("../Models/User"); // Hotel Registered table

// ------------------------ CREATE BOOKING SOURCE ------------------------
const createBookingSource = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId =req.userId
    const hotel = await RegisteredUser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const newSource = new BookingSource({
      hotelId: hotel._id,
      userId,
      name: req.body.name,
      definedBy: req.body.definedBy || "User",
      isActive: req.body.isActive
    });

    await newSource.save();

    res.status(201).json({
      message: "Booking Source created successfully",
      data: newSource
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to create", error });
  }
};

// ------------------------ GET ALL BOOKING SOURCES ------------------------
const getBookingSources = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await RegisteredUser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await BookingSource.find({
      hotelId: hotel._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Booking Source List",
      data: list
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch", error });
  }
};

// ------------------------ UPDATE BOOKING SOURCE ------------------------
const updateBookingSource = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await RegisteredUser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await BookingSource.findOneAndUpdate(
      { _id: id, hotelId: hotel._id }, // sirf hotelId filter
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking Source not found" });
    }

    res.status(200).json({
      message: "Updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to update", error });
  }
};

// ------------------------ DELETE BOOKING SOURCE ------------------------
const deleteBookingSource = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await RegisteredUser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await BookingSource.findOneAndDelete({
      _id: id,
      hotelId: hotel._id // sirf hotelId filter
    });

    if (!deleted) {
      return res.status(404).json({ message: "Booking Source not found" });
    }

    res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error });
  }
};

module.exports = {
  createBookingSource,
  getBookingSources,
  updateBookingSource,
  deleteBookingSource
};
