const LedgerAccount = require("../Models/LedgerAccount");
const Registereduser = require("../Models/User");

// ✅ CREATE LEDGER
const createLedgerAccount = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const ledger = new LedgerAccount({
      hotelId: hotel._id,        // 🔥 HOTEL LEVEL
      userId: req.userId,     // 🟡 optional (audit)
      ...req.body
    });

    await ledger.save();

    res.status(201).json({
      message: "Ledger Account Created Successfully",
      data: ledger
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error
    });
  }
};


const getLedgerAccounts = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const ledgers = await LedgerAccount.find({
      hotelId: hotel._id          // 🔥 ONLY hotel filter
    }).sort({ accountName: 1 });

    res.status(200).json({
      message: "Ledger Account List",
      data: ledgers
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch data",
      error
    });
  }
};


const updateLedgerAccount = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await LedgerAccount.findOneAndUpdate(
      {
        _id: id,
        hotelId: hotel._id        // 🔥 hotel wise update
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    res.json({
      message: "Ledger Updated Successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};


const deleteLedgerAccount = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await LedgerAccount.findOneAndDelete({
      _id: id,
      hotelId: hotel._id          // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Ledger not found" });
    }

    res.json({ message: "Ledger Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};

module.exports = {
  createLedgerAccount,
  getLedgerAccounts,
  updateLedgerAccount,
  deleteLedgerAccount
};
