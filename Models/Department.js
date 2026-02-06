const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
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
      enum: ["User", "UserMaster"],
      required: true
    },

    departmentName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    shortName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    departmentNature: {
      type: String,
      required: true,
      enum: ["Kitchen", "Service", "Admin", "Store", "Others"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
