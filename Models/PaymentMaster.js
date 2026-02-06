const mongoose = require("mongoose");

const paymentMasterSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // Registereduser (hotel)
      required: true
    },

    paymentName: {
      type: String,
      required: true,
      trim: true
    },

    ledgerAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LedgerAccount",
    },

    acPosting: {
      type: String,
      enum: ["Detailed", "Summarized"],
      required: true
    },

    nature: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Company", "Room", "Hold"],
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMaster", paymentMasterSchema);
