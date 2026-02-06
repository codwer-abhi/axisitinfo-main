const mongoose = require("mongoose");

const planMasterSchema = new mongoose.Schema(
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

    // ⭐ AUTO GENERATED PLAN CODE
    planCode: {
      type: Number,
      required: true,
      index: true,
    },

    planName: { type: String, required: true },
    planAmount: { type: Number, default: 0 },

    tariff: { type: String },
    discountApplicable: { type: String },   // Yes / No
    roomTaxIncludeYn: { type: String },     // Yes / No

    roomCategory: { type: String, required: true },
    roomTaxStructure: { type: String },

    activeYn: { type: String, default: "Active" },

    desc1: { type: String },
    desc2: { type: String },

    adult: { type: Number, default: 0 },
    child: { type: Number, default: 0 },

    mapCode: { type: String },

    netAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    defined: { type: String, default: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlanMaster", planMasterSchema);
