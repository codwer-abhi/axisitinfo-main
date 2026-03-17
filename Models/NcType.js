const mongoose = require("mongoose");

const ncTypeSchema = new mongoose.Schema(
{
  hotelId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  hotelCode:{
    type:String,
    required:true
  },

  name:{
    type:String,
    required:true,
    trim:true
  },

  percentage:{
    type:Number,
    required:true
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    refPath:"createdByModel"
  },

  createdByModel:{
    type:String,
    enum:["User","UserMaster"]
  }

},
{timestamps:true}
);

module.exports = mongoose.model("NcType",ncTypeSchema);