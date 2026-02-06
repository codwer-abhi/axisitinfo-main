const Ledger = require("../Models/Ledger");
const Registereduser = require("../Models/User");

// ================= CREATE =================
const createLedger = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

const { accountName, userGroup } = req.body;

if (!accountName || !userGroup) {
  return res.status(400).json({
    message: "Account Name and Group Account are required"
  });
}

    // 🔐 Hotel verify
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🚫 Duplicate (hotel wise)
const exists = await Ledger.findOne({
  hotelId: hotel._id,
  accountName,
  userGroup
});


    if (exists) {
      return res.status(409).json({
        message: "Ledger already exists"
      });
    }

  const ledger = await Ledger.create({
  hotelId: hotel._id,
  hotelCode,
  accountName,
  userGroup,
  tdsCategory: req.body.tdsCategory,
  debitPeriod: req.body.debitPeriod,
  address: req.body.address,
  city: req.body.city,
  state: req.body.state,
  email: req.body.email,
  mobile: req.body.mobile,
  creditDays: req.body.creditDays,
  panNo: req.body.panNo,
  gstin: req.body.gstin,
  region: req.body.region,
  openingBalance: req.body.openingBalance,
  isActive: req.body.isActive,
  createdBy: userId,
  createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster"
});


    res.status(201).json({
      message: "Ledger created successfully",
      data: ledger
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create ledger",
      error: error.message
    });
  }
};

// ================= LIST =================
const getLedgers = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const ledgers = await Ledger.find({ hotelId: hotel._id })
      .populate("userGroup", "groupName nature mainGroup")
.populate("createdBy", "username name")
      .sort({ accountName: 1 });

    res.status(200).json({
      message: "Ledger list",
      data: ledgers
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ledgers",
      error: error.message
    });
  }
};

// ================= UPDATE =================
const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await Ledger.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    res.status(200).json({
      message: "Ledger updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update ledger",
      error: error.message
    });
  }
};

// ================= DELETE =================
const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await Ledger.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    res.status(200).json({
      message: "Ledger deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ledger",
      error: error.message
    });
  }
};
module.exports={
    createLedger,
    getLedgers,
    updateLedger,
    deleteLedger
}