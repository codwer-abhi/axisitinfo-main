const mongoose = require("mongoose");

const generalParameterSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true,
    unique: true,  // हर hotel के लिए एक ही data
  },
  
  editArrDateTime: String,
  cancellationAC: String,
  advanceRoomRentAC: String,
  grcMandatory: String,
  makeNoShow: String,
  seperateLetter: String,
  
  checkOutTime: String,
  checkInTime: String,
  cashPurchaseEffect: String,
  pageOpenAfterWalkin: String,
  roomInclusive: String,

  roomRateEditable: String,
  roomIncTaxEditable: String,
  roomIncTaxDefault: String,
  blockInvalidTariff: String,
  reservationExpandOnSave: String,
  billCopies: String,
  planCalculation: String,
  autoFillRoomRes: String,
  emptyRoomAssignRes: String,
  allowCheckinSubmit: String,

}, { timestamps: true });

module.exports = mongoose.model("GeneralParameter", generalParameterSchema);
