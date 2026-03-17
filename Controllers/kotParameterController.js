const KOTParameter = require("../Models/KOTParameter");
const Registereduser = require("../Models/User");


// ================= SAVE / UPDATE =================

const saveKOTParameter = async (req,res)=>{

try{

const hotelCode = req.hotelId;
const userId = req.userId;

const {

printKOT,
printEditKOT,
outletSelection,
ncKotPercentage,
printRateKOT,
printKOTHeader1,
printKOTHeader2,
printKOTHeader3,
printKOTHeader4,
systemBasedPrinting

} = req.body;


// hotel validation
const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({
message:"Invalid Hotel Code"
});

}


// check existing record
let record = await KOTParameter.findOne({

hotelId:hotel._id

});


// update if exists
if(record){

record = await KOTParameter.findOneAndUpdate(

{hotelId:hotel._id},
req.body,
{new:true}

);

return res.status(200).json({

message:"KOT Parameter updated",
data:record

});

}


// create new record
const newRecord = await KOTParameter.create({

hotelId:hotel._id,
hotelCode:hotelCode,
createdBy:userId,
createdByModel:req.loginType === "OWNER" ? "User" : "UserMaster",

printKOT,
printEditKOT,
outletSelection,
ncKotPercentage,
printRateKOT,
printKOTHeader1,
printKOTHeader2,
printKOTHeader3,
printKOTHeader4,
systemBasedPrinting

});


res.status(201).json({

message:"KOT Parameter saved",
data:newRecord

});

}catch(error){

res.status(500).json({

message:"Failed to save KOT parameter",
error

});

}

};



// ================= GET =================

const getKOTParameter = async (req,res)=>{

try{

const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({
message:"Invalid Hotel Code"
});

}

const data = await KOTParameter.findOne({

hotelId:hotel._id

}).populate("createdBy","username");


res.status(200).json({

message:"KOT Parameter",
data

});

}catch(error){

res.status(500).json({

message:"Failed to fetch KOT parameter",
error

});

}

};


module.exports={

saveKOTParameter,
getKOTParameter

};