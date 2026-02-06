const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
  occType: String,
  highRate: Number,
  rackRate: Number,
  disk1Rate: Number,
  disk2Rate: Number,
  disk3Rate: Number,
});

const roomMasterSchema = new mongoose.Schema(
  {
    roomNo: { type: Number, required: true },
    roomName: { type: String, required: true },

    roomCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomCategory",
      required: true,
    },
    chargeMaster:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"ChargeMaster",
      required:true
    },
    multiplePerson: { type: Boolean, default: false },

    houseKeeping: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    photo: { type: String, default: null },

    rates: [rateSchema],

    hotelId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "RegisteredUser",
         required: true,
       },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomMaster", roomMasterSchema);
