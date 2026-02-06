const mongoose = require("mongoose");

const groupAccountSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registereduser",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    groupName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    nature: {
      type: String,
      enum: [
        "Bank",
        "Cash",
        "Supplier",
        "Customer",
        "Purchase",
        "Sale",
        "Others",
      ],
      required: true,
    },

    mainGroup: {
      type: String,
      required: true,
      uppercase: true,
    },

    underGroup: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupAccount", groupAccountSchema);
