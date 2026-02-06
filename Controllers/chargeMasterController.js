const ChargeMaster = require("../Models/ChargeMaster");
const Registereduser = require("../Models/User");
const Ledger = require("../Models/Ledger");
const TaxStructure = require("../Models/TaxStructure");

const createCharge = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // ✅ Validate Ledger
    const ledger = await Ledger.findById(req.body.accountName);
    if (!ledger) {
      return res.status(400).json({ message: "Invalid Ledger selected" });
    }

    // ✅ Validate Tax Structure
    const tax = await TaxStructure.findById(req.body.taxStructure);
    if (!tax) {
      return res.status(400).json({ message: "Invalid Tax Structure selected" });
    }

    const newCharge = new ChargeMaster({
      hotelId: hotel._id,
      userId,
      ...req.body
    });

    await newCharge.save();

    res.status(201).json({
      message: "Charge created successfully",
      data: newCharge
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating charge",
      error: error.message
    });
  }
};


// ⭐ GET ALL Charges
const getCharges = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

   const charges = await ChargeMaster.find({
  hotelId: hotel._id
})
.populate({
  path: "accountName",
  select: "accountName nature groupAccount"
})
.populate({
  path: "taxStructure",
  select: "taxStructureName rows",
  populate: {
    path: "rows.taxMaster",
    select: "taxName accountName sundryName payableAccount unregisteredAccount",
    populate: [
      { path: "accountName", select: "accountName groupAccount" },
      { path: "payableAccount", select: "accountName groupAccount" },
      { path: "unregisteredAccount", select: "accountName groupAccount" },
      { path: "sundryName", select: "sundryName nature calcSign" }
    ]
  }
})
.sort({ seqNo: 1 });


    res.status(200).json({
      message: "Charges fetched successfully",
      data: charges
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching charges",
      error: error.message
    });
  }
};



// ⭐ UPDATE Charge
const updateCharge = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // Optional re-validation
    if (req.body.accountName) {
      const ledger = await Ledger.findById(req.body.accountName);
      if (!ledger) {
        return res.status(400).json({ message: "Invalid Ledger selected" });
      }
    }

    if (req.body.taxStructure) {
      const tax = await TaxStructure.findById(req.body.taxStructure);
      if (!tax) {
        return res.status(400).json({ message: "Invalid Tax Structure selected" });
      }
    }

    const updated = await ChargeMaster.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Charge not found" });
    }

    res.status(200).json({
      message: "Charge updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating charge",
      error: error.message
    });
  }
};


// ⭐ DELETE Charge
const deleteCharge = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await ChargeMaster.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Charge not found" });
    }

    res.status(200).json({
      message: "Charge deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting charge",
      error,
    });
  }
};


module.exports = {
  createCharge,
  getCharges,
  updateCharge,
  deleteCharge
};