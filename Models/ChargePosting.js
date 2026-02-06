const mongoose = require("mongoose");

const chargePostingSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },

  checkinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Checkin",
    required: true
  },

  folioNo: {
    type: Number,
    required: true
  },

  chargeDate: {
    type: String,
    required: true
  },

  chargeType: {
    type: String,
    enum: ["ROOM", "PLAN", "EXTRA"],
    required: true
  },

  description: String,

  rate: Number,
  nights: Number,

  taxAmount: Number,

  totalAmount: {
    type: Number,
    required: true
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser"
  }

}, { timestamps: true });

module.exports = mongoose.model("ChargePosting", chargePostingSchema);
