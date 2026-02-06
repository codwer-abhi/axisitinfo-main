// Models/BusinessDate.js
const mongoose = require("mongoose");

const businessDateSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true,
    unique: true
  },

  currentDate: {
    type: String, // "2025-07-18"
    required: true
  },

  lastAuditDate: {
    type: String
  },

  status: {
    type: String,
    enum: ["OPEN", "CLOSED"],
    default: "OPEN"
  }

}, { timestamps: true });

module.exports = mongoose.model("BusinessDate", businessDateSchema);
