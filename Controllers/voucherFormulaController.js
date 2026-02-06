const VoucherFormula = require("../Models/VoucherFormula");
const Registereduser = require("../Models/User");
const Outlet = require("../Models/Outlet");

/* ================= CREATE ================= */
const createVoucherFormula = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const { voucherType, applyDate, rows } = req.body;

    if (!voucherType || !applyDate || !rows?.length) {
      return res.status(400).json({
        message: "Voucher type, apply date & rows are required"
      });
    }

    /* 🔐 Hotel validation */
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    /* 🔐 Outlet validation (voucherType = Outlet ID) */
    const outlet = await Outlet.findOne({
      _id: voucherType,
      hotelId: hotel._id
    });

    if (!outlet) {
      return res.status(404).json({
        message: "Invalid Outlet / Voucher Type"
      });
    }

    const formula = await VoucherFormula.create({
      hotelId: hotel._id,
      hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",
      voucherType: outlet._id,
      applyDate,
      rows
    });

    res.status(201).json({
      message: "Voucher formula created successfully",
      data: formula
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create voucher formula",
      error
    });
  }
};

/* ================= LIST ================= */
const getVoucherFormulas = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await VoucherFormula.find({
      hotelId: hotel._id
    })
      .populate("voucherType", "outletName shortName outletNature")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Voucher formula list",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch voucher formulas",
      error
    });
  }
};

/* ================= UPDATE ================= */
const updateVoucherFormula = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    /* If voucherType is being updated, validate outlet again */
    if (req.body.voucherType) {
      const outlet = await Outlet.findOne({
        _id: req.body.voucherType,
        hotelId: hotel._id
      });

      if (!outlet) {
        return res.status(404).json({
          message: "Invalid Outlet / Voucher Type"
        });
      }
    }

    const updated = await VoucherFormula.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    )
      .populate("voucherType", "outletName shortName outletNature")
      .populate("createdBy", "username");

    if (!updated) {
      return res.status(404).json({ message: "Voucher formula not found" });
    }

    res.status(200).json({
      message: "Voucher formula updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update voucher formula",
      error
    });
  }
};

/* ================= DELETE ================= */
const deleteVoucherFormula = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await VoucherFormula.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Voucher formula not found" });
    }

    res.status(200).json({
      message: "Voucher formula deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete voucher formula",
      error
    });
  }
};

module.exports = {
  createVoucherFormula,
  getVoucherFormulas,
  updateVoucherFormula,
  deleteVoucherFormula
};
