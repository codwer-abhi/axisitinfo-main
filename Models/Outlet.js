const mongoose = require("mongoose");

const outletSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  /* ================= OUTLET DETAILS ================= */
  outletName: { type: String, required: true },
  shortName: { type: String },
  outletNature: { type: String }, // Outlet / Room Service etc
  mobileNo: { type: String },

  kot: { type: Boolean, default: false },
  splitBill: { type: Boolean, default: false },
  orderBooking: { type: Boolean, default: false },
  labelPrinting: { type: Boolean, default: false },
  barCodeApp: { type: Boolean, default: false },

  divCode: { type: String },

  companyName: { type: String },
  gstin: { type: String },
  companyLogo: { type: String },

  /* ================= KOT PRINTING ================= */
  kotPrintType: { type: String },
  printingType: { type: String },
  printingPathType: { type: String },
  noOfKot: { type: Number },
  currentTokenNo: { type: Number },

  /* ================= SALE BILL SETUP ================= */
  partyName: { type: Boolean },
  customerInfo: { type: Boolean },
  cover: { type: Boolean },
  printOnSave: { type: Boolean },
  mobilePrint: { type: Boolean },
  memberInfo: { type: Boolean },
  freeItemApp: { type: Boolean },
  autoSettlement: { type: Boolean },
  autoResetToken: { type: Boolean },

  /* ================= BILL PRINTING ================= */
  compTitle: { type: String },
  outletTitle: { type: String },
  noOfBills: { type: Number },
  discountPrint: { type: Boolean },
  printTokenNumber: { type: Boolean },
  printTokenBefore: { type: Boolean },
  printTokenAfter: { type: Boolean },
  groupDiscount: { type: Boolean },

  header1: String,
  header2: String,
  header3: String,
  header4: String,

  slogan1: String,
  slogan2: String,
  tokenHeader: String,

  /* ================= ORDER BOOKING ================= */
  firstCopyRemark: String,
  secondCopyRemark: String,
  
  name: String,
  discount: String,
  /* ================= DISPLAY ================= */
  heightWidth: Number,
  column: Number,
  fontSize: Number,
  borderSpacing: Number

}, { timestamps: true });

module.exports = mongoose.model("Outlet", outletSchema);
