const Outlet = require("../Models/Outlet");
const Registereduser = require("../Models/User");

/* ================= CREATE OUTLET ================= */
const createOutlet = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const logoUrl = req.file ? req.file.path : null;

    const outlet = new Outlet({
      ...req.body,
      hotelId: hotel._id,
      userId,
      companyLogo: logoUrl   // ⭐ IMAGE URL
    });

    await outlet.save();

    res.status(201).json({
      message: "Outlet created successfully",
      data: outlet
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating outlet",
      error: error.message
    });
  }
};


/* ================= GET ALL OUTLETS ================= */
const getOutlets = async (req, res) => {
  try {
    const hotel = await Registereduser.findOne({ hotelCode: req.hotelId });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel Code" });

    const outlets = await Outlet.find({ hotelId: hotel._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Outlets fetched successfully",
      data: outlets
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching outlets",
      error: error.message
    });
  }
};

/* ================= UPDATE OUTLET ================= */
const updateOutlet = async (req, res) => {
  try {
    const { id } = req.params;

    /* ========= 1. body clone ========= */
    const updatedData = { ...req.body };

    /* ========= 2. string → boolean ========= */
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === "true") updatedData[key] = true;
      if (updatedData[key] === "false") updatedData[key] = false;
    });

    /* ========= 3. logo handle ========= */
    let logoUrl = null;
    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
      updatedData.companyLogo = logoUrl;
    }

    /* ========= 4. update db ========= */
    const updatedOutlet = await Outlet.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedOutlet) {
      return res.status(404).json({ message: "Outlet not found" });
    }

    res.status(200).json({
      message: "Outlet updated successfully",
      data: updatedOutlet
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


/* ================= DELETE OUTLET ================= */
const deleteOutlet = async (req, res) => {
  try {
    const hotel = await Registereduser.findOne({ hotelCode: req.hotelId });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel Code" });

    const deleted = await Outlet.findOneAndDelete({
      _id: req.params.id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Outlet not found" });
    }

    res.status(200).json({ message: "Outlet deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting outlet",
      error: error.message
    });
  }
};

module.exports = {
  createOutlet,
  getOutlets,
  updateOutlet,
  deleteOutlet
};
