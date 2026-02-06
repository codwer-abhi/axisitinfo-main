const mongoose = require("mongoose");


// ChargeMaster.js
const chargeMasterSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RegisteredUser",
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  chargeName: { type: String, required: true },
  natureOfCharge: { type: String, required: true },
  hsnCode: { type: String },

  accountName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger",   // ✅ BEST PRACTICE
    required: true
  },

  // 🔥🔥 FIXED LINE 🔥🔥
  taxStructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaxStructure",    // ✅ NOW POPULATE WILL WORK
    required: true
  },

  seqNo: { type: Number, required: true },

  taxInclusive: { type: String, default: "Yes" },
  postingType: { type: String, required: true },
  type: { type: String, required: true },
  saleRate: { type: Number, default: 0 },

  active: { type: Boolean, default: true },
  defined: { type: String, default: "User" }

}, { timestamps: true });

module.exports = mongoose.model("ChargeMaster", chargeMasterSchema);

