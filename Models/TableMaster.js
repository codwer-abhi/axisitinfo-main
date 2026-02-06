const mongoose = require("mongoose");

const tableMasterSchema = new mongoose.Schema(
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

    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
      required: true
    },

    tableName: {
      type: String,
      required: true,
      trim: true
    },

    tableCode: {
      type: String,
      required: true,
      trim: true
    },

    activeYN: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TableMaster", tableMasterSchema);
