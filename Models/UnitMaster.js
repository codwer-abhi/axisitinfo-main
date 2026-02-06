const mongoose = require("mongoose");

const unitMasterSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    hotelCode: {
      type: String,
      required: true
    },

    unitName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    defined: {
      type: String,
      enum: ["System", "User"],
      default: "User"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel"
    },

    createdByModel: {
      type: String,
      enum: ["User", "UserMaster"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UnitMaster", unitMasterSchema);
