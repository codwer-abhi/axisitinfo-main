const mongoose = require("mongoose");

const openingBalanceSchema = new mongoose.Schema({
  refDate: { type: Date, required: true },
  narration: { type: String },
  amount: { type: Number, required: true },
  crDr: {
    type: String,
    enum: ["Cr", "Dr"],
    required: true
  }
}, { _id: false });

const companySchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },

  accountName: { type: String, required: true },
  underGroup: { type: String },
  companyType: { type: String },
  allowCredit: { type: String },
  mapCode: { type: String },
  contactPerson: { type: String },
  discountType: { type: String },

  address: { type: String, required: true },
  city: { type: String },
  mobile: { type: String },
  email: { type: String },
  panNo: { type: String },
  gstin: { type: String },

  // 🔥 OPENING BALANCE TABLE
  openingBalances: [openingBalanceSchema],

  isActive: {
    type: String,
    enum: ["Active", "In Active"],
    default: "Active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
