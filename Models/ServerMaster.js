const mongoose = require("mongoose");

const serverMasterSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registereduser",
      required: true
    },

    hotelCode: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true
    },

    createdByModel: {
      type: String,
      enum: ["User", "UserMaster"],
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServerMaster", serverMasterSchema);
