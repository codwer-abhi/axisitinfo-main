const mongoose = require("mongoose");

const checkoutParameterSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Registereduser", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Registereduser", required: true },

  billPrintingSummerized: String,
  taxSummaryInBillPrinting: String,
  variationBeforeCheckIn: String,
  variationAfterCheckIn: String,
  emailDisplay: String,
  websiteDisplay: String,

  roomRentChargeVariation: String,
  roomRentPostingAtCheckout: String,
  splitBillAuto: String,
  roomCheckoutClearanceVerify: String,
  logoDisplay: String,

}, { timestamps: true });

module.exports = mongoose.model("CheckoutParameter", checkoutParameterSchema);
