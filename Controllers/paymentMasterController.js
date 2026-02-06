const PaymentMaster = require("../Models/PaymentMaster");
const Registereduser = require("../Models/User");

// ✅ CREATE PAYMENT MASTER
const createPaymentMaster = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const payment = new PaymentMaster({
      hotelId: hotel._id,           // 🔥 HOTEL LEVEL
      paymentName: req.body.paymentName,
      ledgerAccountId: req.body.ledgerAccountId,
      acPosting: req.body.acPosting,
      nature: req.body.nature,
      createdBy: req.userId         // 🟡 optional (audit)
    });

    await payment.save();

    res.status(201).json({
      message: "Payment Master created successfully",
      data: payment
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create Payment Master",
      error
    });
  }
};

const getPaymentMasters = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const payments = await PaymentMaster.find({
      hotelId: hotel._id           // 🔥 ONLY hotel filter
    })
      .populate("ledgerAccountId", "accountName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Payment Masters fetched",
      data: payments
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Payment Masters",
      error
    });
  }
};


const updatePaymentMaster = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await PaymentMaster.findOneAndUpdate(
      {
        _id: id,
        hotelId: hotel._id          // 🔥 hotel wise update
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({
      message: "Payment Master updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error
    });
  }
};


const deletePaymentMaster = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await PaymentMaster.findOneAndDelete({
      _id: id,
      hotelId: hotel._id            // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Payment Master deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error
    });
  }
};


module.exports = {
  createPaymentMaster,
  getPaymentMasters,
  updatePaymentMaster,
  deletePaymentMaster
};
