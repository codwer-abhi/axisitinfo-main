const mongoose = require("mongoose");

const rateTypeSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    rate1: { type: String, default: "" },
    rate2: { type: String, default: "" },
    rate3: { type: String, default: "" },
    rate4: { type: String, default: "" },
    rate5: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RateType", rateTypeSchema);
