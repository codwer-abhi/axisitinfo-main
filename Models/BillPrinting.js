const mongoose = require("mongoose");

const billPrintingSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    module: {
      type: String,
      required: true
    },

    departmentName: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    printingPath: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BillPrinting", billPrintingSchema);
