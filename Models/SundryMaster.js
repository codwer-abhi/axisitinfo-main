const mongoose = require("mongoose");

const sundryMasterSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registereduser",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserMaster"
    },

    sundryName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    nature: {
      type: String,
      enum: [
        "Addition",
        "Advance",
        "Amount",
        "CGST",
        "Deduction",
        "Discount",
        "IGST",
        "Net Amount",
        "Redemption",
        "Round Off",
        "Sale Tax",
        "Service Charge",
        "SGST"
      ],
      required: true
    },

    calcSign: {
      type: String,
      enum: ["+", "-"],
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SundryMaster", sundryMasterSchema);
