const OutletParameter = require("../Models/OutletParameter");
const Registereduser = require("../Models/User");


// ================= SAVE / UPDATE =================

const saveOutletParameter = async (req,res)=>{

try{

const hotelCode = req.hotelId;
const userId = req.userId;

const {

cashPaymentType,
roundOfType,
saleBillFontSize,
reprintOnSaleBill,
postPosDiscSeparately,
taxSummaryOnSaleBill

} = req.body;


// hotel validation
const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){
return res.status(404).json({
message:"Invalid Hotel Code"
});
}


// check existing
let record = await OutletParameter.findOne({
hotelId:hotel._id
});


// update if exists
if(record){

record = await OutletParameter.findOneAndUpdate(

{hotelId:hotel._id},
req.body,
{new:true}

);

return res.status(200).json({
message:"Outlet Parameter updated",
data:record
});

}


// create new
const newRecord = await OutletParameter.create({

hotelId:hotel._id,
hotelCode:hotelCode,
createdBy:userId,
createdByModel:req.loginType === "OWNER" ? "User" : "UserMaster",

cashPaymentType,
roundOfType,
saleBillFontSize,
reprintOnSaleBill,
postPosDiscSeparately,
taxSummaryOnSaleBill

});


res.status(201).json({

message:"Outlet Parameter saved",
data:newRecord

});

}catch(error){

res.status(500).json({
message:"Failed to save outlet parameter",
error
});

}

};



// ================= GET =================

const getOutletParameter = async (req,res)=>{

try{

const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({
message:"Invalid Hotel Code"
});

}

const data = await OutletParameter.findOne({

hotelId:hotel._id

}).populate("createdBy","username");


res.status(200).json({

message:"Outlet Parameter",
data

});

}catch(error){

res.status(500).json({

message:"Failed to fetch outlet parameter",
error

});

}

};


module.exports={

saveOutletParameter,
getOutletParameter

};