// Models/UserMaster.js
const mongoose = require("mongoose");

const UserMasterSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  hotelCode: {
    type: String,          // ✅ STRING
    required: true,
    index: true
  },

  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  isSupervisor: {
    type: Boolean,
    default: false
  },

  allowBackDate: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("UserMaster", UserMasterSchema);
