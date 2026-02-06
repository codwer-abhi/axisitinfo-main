const TaxMaster = require("../Models/TaxMaster");
const Registereduser = require("../Models/User");
const Ledger = require("../Models/Ledger");
const SundryMaster = require("../Models/SundryMaster");

// ➕ CREATE TAX
const createTax = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const {
      accountName,
      sundryName,
      payableAccount,
      unregisteredAccount
    } = req.body;

    // 🔹 VALIDATIONS
    if (!(await Ledger.findById(accountName)))
      return res.status(400).json({ message: "Invalid Tax Ledger" });

    if (!(await SundryMaster.findById(sundryName)))
      return res.status(400).json({ message: "Invalid Sundry Selected" });

    if (!(await Ledger.findById(payableAccount)))
      return res.status(400).json({ message: "Invalid Payable Ledger" });

    if (!(await Ledger.findById(unregisteredAccount)))
      return res.status(400).json({ message: "Invalid Unregistered Ledger" });

    const tax = new TaxMaster({
      hotelId: hotel._id,
      ...req.body
    });

    await tax.save();

    res.status(201).json({
      message: "Tax created successfully",
      data: tax
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create tax",
      error: error.message
    });
  }
};



// 📥 GET ALL TAXES (HOTEL WISE)
const getTaxes = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const taxes = await TaxMaster.find({ hotelId: hotel._id })
      .populate({
        path: "accountName",
        select: "accountName groupAccount nature"
      })
      .populate({
        path: "payableAccount",
        select: "accountName groupAccount"
      })
      .populate({
        path: "unregisteredAccount",
        select: "accountName groupAccount"
      })
      .populate({
        path: "sundryName",
        select: "sundryName nature calcSign"
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tax list",
      data: taxes
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch taxes",
      error: error.message
    });
  }
};


// ✏️ UPDATE TAX
const updateTax = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔹 Optional re-validation
    if (req.body.accountName && !(await Ledger.findById(req.body.accountName)))
      return res.status(400).json({ message: "Invalid Tax Ledger" });

    if (req.body.sundryName && !(await SundryMaster.findById(req.body.sundryName)))
      return res.status(400).json({ message: "Invalid Sundry" });

    if (req.body.payableAccount && !(await Ledger.findById(req.body.payableAccount)))
      return res.status(400).json({ message: "Invalid Payable Ledger" });

    if (req.body.unregisteredAccount && !(await Ledger.findById(req.body.unregisteredAccount)))
      return res.status(400).json({ message: "Invalid Unregistered Ledger" });

    const tax = await TaxMaster.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!tax) {
      return res.status(404).json({ message: "Tax not found" });
    }

    res.status(200).json({
      message: "Tax updated",
      data: tax
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update tax",
      error: error.message
    });
  }
};


// ❌ DELETE TAX
const deleteTax = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    await TaxMaster.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    res.status(200).json({
      message: "Tax deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete tax",
      error: error.message
    });
  }
};


module.exports = {
  createTax,
  getTaxes,
  updateTax,
  deleteTax
};
