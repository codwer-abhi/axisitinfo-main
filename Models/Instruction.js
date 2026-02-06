const mongoose = require("mongoose");

const instructionSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    instruction1: { type: String, default: "" },
    instruction2: { type: String, default: "" },
    instruction3: { type: String, default: "" },
    instruction4: { type: String, default: "" },
    instruction5: { type: String, default: "" },
    instruction6: { type: String, default: "" },
    instruction7: { type: String, default: "" },
    instruction8: { type: String, default: "" },
    instruction9: { type: String, default: "" },
    instruction10: { type: String, default: "" },
    instruction11: { type: String, default: "" },
    instruction12: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Instruction", instructionSchema);
