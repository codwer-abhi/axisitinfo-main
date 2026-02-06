const BillPrinting = require("../Models/BillPrinting");
const Registereduser = require("../Models/User");

// ------------------------ CREATE BILL PRINTING ------------------------
const createBillPrinting = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const record = new BillPrinting({
      hotelId: hotel._id,  // 🔹 hotel level
      module: req.body.module,
      departmentName: req.body.departmentName,
      description: req.body.description,
      printingPath: req.body.printingPath,
      createdBy: userId
    });

    await record.save();

    res.status(201).json({
      message: "Bill Printing configuration saved",
      data: record
    });

  } catch (error) {
    res.status(500).json({ message: "Creation failed", error });
  }
};

// ------------------------ GET BILL PRINTING LIST ------------------------
const getBillPrintingList = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel Code" });

    const list = await BillPrinting.find({
      hotelId: hotel._id  // 🔹 hotel filter
    }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "Bill Printing list fetched",
      data: list
    });

  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error });
  }
};

// ------------------------ UPDATE BILL PRINTING ------------------------
const updateBillPrinting = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel Code" });

    const updated = await BillPrinting.findOneAndUpdate(
      { _id: id, hotelId: hotel._id }, // 🔹 hotel filter applied
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({
      message: "Updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

// ------------------------ DELETE BILL PRINTING ------------------------
const deleteBillPrinting = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel Code" });

    const deleted = await BillPrinting.findOneAndDelete({
      _id: id,
      hotelId: hotel._id  // 🔹 hotel filter applied
    });

    if (!deleted) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};

module.exports = {
  createBillPrinting,
  getBillPrintingList,
  updateBillPrinting,
  deleteBillPrinting
};
