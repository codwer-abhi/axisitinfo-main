const mongoose = require("mongoose");

const roomFeatureSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredUser",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    defined: {
      type: String,
      default: "User",   // System | User
    },

    active: {
      type: String,
      default: "Active", // Active | In Active
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomFeature", roomFeatureSchema);
