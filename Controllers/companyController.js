const Company = require("../Models/Company");
const Registereduser = require("../Models/User");

// ✅ CREATE COMPANY
const createCompany = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const { openingBalances, ...companyData } = req.body;

    const company = new Company({
      hotelId: hotel._id,          // 🔥 ONLY hotel
      userId: req.userId,       // 🟡 audit purpose
      ...companyData,
      openingBalances
    });

    await company.save();

    res.status(201).json({
      message: "Company Created Successfully",
      data: company
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create company",
      error
    });
  }
};



const getCompanies = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const companies = await Company.find({
      hotelId: hotel._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Company List",
      data: companies
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch companies",
      error
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await Company.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company Updated",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error
    });
  }
};


const deleteCompany = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await Company.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company Deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error
    });
  }
};


module.exports = {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany
};
