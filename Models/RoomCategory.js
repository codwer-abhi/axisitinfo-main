const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
  occType: String,      // Single, Double, Triple, Quad
  highRate: Number,
  rackRate: Number,
  disk1: Number,
  disk2: Number,
  disk3: Number
});

const roomCategorySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredUser",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    roomType: String,
    shortName: String,
    multiplePerson: Number,
    roomsAvailable: Number,
    revenueCharge: String,

    includeRoomCount: {
      type: String,
      default: "Active"
    },

    active: {
      type: String,
      default: "Active"
    },

    mapCode: String,

    amenities: {
      type: [String],
      default: []
    },

    images: {
      type: [String],  // File URLs
      default: []
    },

    rates: [rateSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomCategory", roomCategorySchema);