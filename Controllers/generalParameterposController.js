const GeneralParameterpos = require("../Models/GeneralParametermodel");
const Registereduser = require("../Models/User");


// ================= CREATE / UPDATE =================

const saveGeneralParameterpos = async (req, res) => {

  try {

    const hotelCode = req.hotelId;
    const userId = req.userId;

    const {
      pendingKotNightAudit,
      unsettledBillNightAudit,
      extraDiscountAllow,
      maintainPosBillEditLog,
      modifyEntryBackDate
    } = req.body;

    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    // check existing record
    let record = await GeneralParameterpos.findOne({
      hotelId: hotel._id
    });

    if (record) {

      record = await GeneralParameterpos.findOneAndUpdate(
        { hotelId: hotel._id },
        req.body,
        { new: true }
      );

      return res.status(200).json({
        message: "General Parameter updated",
        data: record
      });
    }

    const newRecord = await GeneralParameterpos.create({

      hotelId: hotel._id,
      hotelCode: hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",

      pendingKotNightAudit,
      unsettledBillNightAudit,
      extraDiscountAllow,
      maintainPosBillEditLog,
      modifyEntryBackDate

    });

    res.status(201).json({
      message: "General Parameter saved",
      data: newRecord
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to save parameter",
      error
    });

  }

};


// ================= GET =================

const getGeneralParameterpos = async (req, res) => {

  try {

    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({
        message: "Invalid Hotel Code"
      });
    }

    const data = await GeneralParameterpos.findOne({
      hotelId: hotel._id
    }).populate("createdBy", "username");

    res.status(200).json({
      message: "General Parameter",
      data
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch parameter",
      error
    });

  }

};


module.exports = {
  saveGeneralParameterpos,
  getGeneralParameterpos
};