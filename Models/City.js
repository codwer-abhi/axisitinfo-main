const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
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
      required: true,
      refPath: "createdByModel"
    },

    createdByModel: {
      type: String,
      required: true,
      enum: ["User", "UserMaster"]
    },

    cityName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    state: {
      type: String,
      required: true,
      uppercase: true
    },

    country: {
      type: String,
      required: true,
      uppercase: true
    },

    zipCode: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", citySchema);
