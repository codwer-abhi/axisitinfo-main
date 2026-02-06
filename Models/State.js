const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },

  hotelCode: {
    type: String,
    required: true
  },

  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true
  },

  stateName: {
    type: String,
    required: true
  },

  stateCode: {
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
    enum: ["User", "UserMaster"],
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("State", stateSchema);
