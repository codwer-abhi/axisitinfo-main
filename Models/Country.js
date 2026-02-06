const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "createdByModel"   // ⭐ KEY FIX
  },
  hotelCode: {
  type: String,
  required: true
},
  createdByModel: {
    type: String,
    required: true,
    enum: ["User", "UserMaster"]
  },

  countryName: String,
  countryCode: String,
  nationality: String
}, { timestamps: true });

module.exports = mongoose.model("Country", countrySchema);
