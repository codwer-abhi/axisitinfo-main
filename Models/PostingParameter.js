const mongoose = require("mongoose");

const postingParameterSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Registereduser", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Registereduser", required: true },

  roomChargeDueAccount: String,
  postRoomDiscSeparately: String,
  roundOffType: String,
  planTariffNarration: String,
  maintainGuestChargesDeleteLog: String,

}, { timestamps: true });

module.exports = mongoose.model("PostingParameter", postingParameterSchema);
