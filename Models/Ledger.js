const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    hotelCode: {
      type: String,
      required: true
    },

    accountName: {
      type: String,
      required: true,
      trim: true
    },

    userGroup:  {
  type: mongoose.Schema.Types.ObjectId,
  ref: "GroupAccount",
  required: true
},
    tdsCategory: String,
    debitPeriod: String,

    address: String,
    city: String,
    state: String,

    email: String,
    mobile: String,

    creditDays: Number,
    panNo: String,
    gstin: String,
    region: String,

    openingBalance: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel"
    },

    createdByModel: {
      type: String,
      enum: ["User", "UserMaster"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ledger", ledgerSchema);
