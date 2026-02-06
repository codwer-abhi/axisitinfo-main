const mongoose = require('mongoose');

const businessSourceSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: { type: String, required: true },

    defined: { type: String, default: "System" }, // UI me already System hai

    active: { type: Boolean, default: true } // Active/Inactive toggle
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusinessSource", businessSourceSchema);
