const mongoose = require("mongoose");

const ledgerAccountSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ---- IMAGE FIELDS ----
    accountName: { type: String, required: true },     // Account Name
    underGroup: { type: String, required: true },      // Under Group
    nature: { type: String, required: true },          // Others / Customer / Supplier etc

    contactPerson: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,
    mobile: String,
    email: String,

    gstNo: String,
    panNo: String,

    openingBalance: { type: Number, default: 0 },
    openingType: { type: String, enum: ["Dr", "Cr"], default: "Dr" },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LedgerAccount", ledgerAccountSchema);
