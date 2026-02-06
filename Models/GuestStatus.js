const mongoose = require('mongoose');

const guestStatusSchema = new mongoose.Schema(
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

    defined: { type: String, default: "System" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GuestStatus", guestStatusSchema);
