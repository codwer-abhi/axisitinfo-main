// Models/NightAudit.js
const mongoose = require("mongoose");

const nightAuditSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },

  auditDate: {
    type: String,
    required: true
  },

  auditBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser"
  },

  totalCheckins: Number,
  totalRoomCharges: Number,

  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
    default: "SUCCESS"
  }

}, { timestamps: true });

module.exports = mongoose.model("NightAudit", nightAuditSchema);
