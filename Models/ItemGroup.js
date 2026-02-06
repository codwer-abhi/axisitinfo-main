const mongoose = require("mongoose");

const itemGroupSchema = new mongoose.Schema(
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

    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
      required: true
    },

    groupName: {
      type: String,
      required: true,
      trim: true
    },

    activeYN: {
      type: String,
      enum: ["Y", "N"],
      default: "Y"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel"
    },

    createdByModel: {
      type: String,
      enum: ["User", "UserMaster"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItemGroup", itemGroupSchema);
