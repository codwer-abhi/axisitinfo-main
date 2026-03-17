const mongoose = require("mongoose");

const outletParameterSchema = new mongoose.Schema({

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

  cashPaymentType:{
    type:String,
    default:"CASH IN HAND"
  },

  roundOfType:{
    type:String,
    default:"Standard"
  },

  saleBillFontSize:{
    type:Number,
    default:14
  },

  reprintOnSaleBill:{
    type:String,
    enum:["Yes","No"],
    default:"No"
  },

  postPosDiscSeparately:{
    type:String,
    enum:["Yes","No"],
    default:"No"
  },

  taxSummaryOnSaleBill:{
    type:String,
    enum:["Yes","No"],
    default:"No"
  }

},{timestamps:true});

module.exports = mongoose.model("OutletParameter",outletParameterSchema);