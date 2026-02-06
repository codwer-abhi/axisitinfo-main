const mongoose = require("mongoose");

const voucherFormulaSchema = new mongoose.Schema(
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

    voucherType: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Outlet",
      required: true // BAR / LAUNDRY / RESTAURANT
    },

    applyDate: {
      type: Date,
      required: true
    },

    rows: [
      {
        sn: Number,
        name: String,
        displayName: String,
        calcFormula: String,
        pna: {
          type: String, // P / A
          enum: ["P", "A"]
        },
        value: Number,
        bold: Boolean,
        revenueCharge: String,
        am: {
          type: String, // Auto / Manual
          enum: ["Auto", "Manual"]
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("VoucherFormula", voucherFormulaSchema);
