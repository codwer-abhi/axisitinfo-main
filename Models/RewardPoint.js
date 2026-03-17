const mongoose = require("mongoose");

const rewardPointSchema = new mongoose.Schema({

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
ref:"User"
},

createdByModel:{
type:String,
enum:["User","UserMaster"]
},

schemeName:{
type:String,
required:true
},

category:{
type:String,
required:true
},

pointsOnAmount:{
type:Number,
default:0
},

points:{
type:Number,
default:0
},

perPointValue:{
type:Number,
default:0
},

lowerLimit:{
type:Number,
default:0
},

comparison:{
type:String,
enum:[">","<","="],
default:">"
},

upperLimit:{
type:Number,
default:0
}

},{timestamps:true});

module.exports = mongoose.model("RewardPoint",rewardPointSchema);