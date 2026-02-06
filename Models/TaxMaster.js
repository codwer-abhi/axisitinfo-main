const mongoose = require("mongoose");
const taxMasterSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    taxName: {
      type: String,
      required: true
    },

    // Tax ledger (CGST / SGST etc)
    accountName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ledger",
      required: true
    },

    // Sundry type (CGST / SGST / Discount etc)
    sundryName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SundryMaster",
      required: true
    },

    // Output tax payable ledger
    payableAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ledger",
      required: true
    },

    // For unregistered guest cases
    unregisteredAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ledger",
      required: true
    },

    defined: {
      type: String,
      enum: ["System", "User"],
      default: "System"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxMaster", taxMasterSchema);

