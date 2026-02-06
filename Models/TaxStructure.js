const mongoose = require("mongoose");

const taxStructureSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,        // ⭐ hotelCode
      required: true
    },

    taxStructureName: {
      type: String,
      required: true
    },

rows: [
  {
    taxMaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxMaster",
      required: true
    },

    rate: {
      type: Number,
      required: true
    },

    applyOn: {
      type: String,
      required: true
    },

    lowerLimit: Number,
    upperLimit: Number,

    comparison: {
      type: String,
      enum: [">", ">=", "<", "<=", "BETWEEN"]
    },

    condition: String
  }
],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxStructure", taxStructureSchema);
