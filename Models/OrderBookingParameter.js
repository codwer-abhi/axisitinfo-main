const mongoose = require("mongoose");

const orderBookingParameterSchema = new mongoose.Schema({

  hotelId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Registereduser",
    required:true
  },

  hotelCode:{
    type:String,
    required:true
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    refPath:"createdByModel"
  },

  createdByModel:{
    type:String,
    enum:["User","UserMaster"]
  },

  bookingPartyAccount:{
    type:String,
    default:""
  },

  slipFooter1:{
    type:String,
    default:""
  },

  slipFooter2:{
    type:String,
    default:""
  }

},{timestamps:true});

module.exports = mongoose.model("OrderBookingParameter",orderBookingParameterSchema);