const mongoose = require("mongoose");

const mealTimeSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    hotelCode: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    fromTime: {
      type: String,
      required: true
    },

    toTime: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel"
    },

    createdByModel: {
      type: String,
      enum: ["User", "UserMaster"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealTime", mealTimeSchema);