const mongoose = require("mongoose");

const menuCategorySchema = new mongoose.Schema(
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

    categoryName: {
      type: String,
      required: true,
      trim: true
    },

    categoryType: {
      type: String,
      enum: ["CATEGORY", "CHARGE"],
      default: "CATEGORY"
    },

    departType: {
      type: String,
      required: true
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountMaster",
      required: true
    },

    taxStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxStructure"
    },

    activeYN: {
      type: String,
      enum: ["Y", "N"],
      default: "Y"
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

module.exports = mongoose.model("MenuCategory", menuCategorySchema);
