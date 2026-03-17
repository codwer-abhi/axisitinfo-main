const mongoose = require("mongoose");

const generalParameterposSchema = new mongoose.Schema({

  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },

  hotelCode: {
    type: String,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "createdByModel"
  },

  createdByModel: {
    type: String,
    enum: ["User", "UserMaster"]
  },

  pendingKotNightAudit: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  },

  unsettledBillNightAudit: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  },

  extraDiscountAllow: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  },

  maintainPosBillEditLog: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  },

  modifyEntryBackDate: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  }

}, { timestamps: true });

module.exports = mongoose.model("GeneralParameterpos", generalParameterposSchema);