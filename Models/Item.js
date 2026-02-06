const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
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
      refPath: "createdByModel"
    },

    createdByModel: {
      type: String,
      enum: ["User", "UserMaster"],
      required: true
    },

    itemName: {
      type: String,
      required: true,
      trim: true
    },

    barcode: {
      type: String,
      trim: true
    },

    hsnCode: {
      type: String,
      trim: true
    },

    itemImage: {
      type: String   // image path / filename
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
