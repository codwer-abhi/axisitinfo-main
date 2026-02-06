const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
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

    itemGroup: {
      type: String,
      required: true
    },

    itemCategory: {
      type: String,
      required: true
    },

    itemName: {
      type: String,
      required: true
    },

    itemCode: {
      type: String
    },

    hsnCode: {
      type: String
    },

    barCode: {
      type: String
    },

    unit: {
      type: String
    },

    saleRate: {
      type: Number,
      default: 0
    },

    discountApplicable: {
      type: Boolean,
      default: false
    },

    rateEditable: {
      type: Boolean,
      default: false
    },

    rateIncludeTax: {
      type: Boolean,
      default: false
    },

    active: {
      type: Boolean,
      default: true
    },

    kitchen: {
      type: String
    },

    dishType: {
      type: String
    },

    favourite: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      default: "Other"
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

module.exports = mongoose.model("MenuItem", menuItemSchema);
