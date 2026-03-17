const mongoose = require("mongoose");

const kotParameterSchema = new mongoose.Schema({

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

  printKOT:{
    type:String,
    default:"Separate For All Kitchen"
  },

  printEditKOT:{
    type:String,
    default:"All Items"
  },

  outletSelection:{
    type:String,
    enum:["Yes","No"],
    default:"Yes"
  },

  ncKotPercentage:{
    type:Number,
    default:0
  },

  printRateKOT:{
    type:String,
    enum:["Yes","No"],
    default:"No"
  },

  printKOTHeader1:{
    type:String,
    default:""
  },

  printKOTHeader2:{
    type:String,
    default:""
  },

  printKOTHeader3:{
    type:String,
    default:""
  },

  printKOTHeader4:{
    type:String,
    default:""
  },

  systemBasedPrinting:{
    type:String,
    enum:["Yes","No"],
    default:"No"
  }

},{timestamps:true});

module.exports = mongoose.model("KOTParameter",kotParameterSchema);