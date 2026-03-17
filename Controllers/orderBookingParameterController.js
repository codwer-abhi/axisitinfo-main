const OrderBookingParameter = require("../Models/OrderBookingParameter");
const Registereduser = require("../Models/User");


// ================= SAVE / UPDATE =================

const saveOrderBookingParameter = async (req,res)=>{

try{

const hotelCode = req.hotelId;
const userId = req.userId;

const {

bookingPartyAccount,
slipFooter1,
slipFooter2

} = req.body;


// hotel validation
const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({
message:"Invalid Hotel Code"
});

}


// check existing
let record = await OrderBookingParameter.findOne({

hotelId:hotel._id

});


// update if exists
if(record){

record = await OrderBookingParameter.findOneAndUpdate(

{hotelId:hotel._id},
req.body,
{new:true}

);

return res.status(200).json({

message:"Order Booking Parameter updated",
data:record

});

}


// create new
const newRecord = await OrderBookingParameter.create({

hotelId:hotel._id,
hotelCode:hotelCode,
createdBy:userId,
createdByModel:req.loginType === "OWNER" ? "User" : "UserMaster",

bookingPartyAccount,
slipFooter1,
slipFooter2

});


res.status(201).json({

message:"Order Booking Parameter saved",
data:newRecord

});

}catch(error){

res.status(500).json({

message:"Failed to save order booking parameter",
error

});

}

};



// ================= GET =================

const getOrderBookingParameter = async (req,res)=>{

try{

const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({
message:"Invalid Hotel Code"
});

}

const data = await OrderBookingParameter.findOne({

hotelId:hotel._id

}).populate("createdBy","username");


res.status(200).json({

message:"Order Booking Parameter",
data

});

}catch(error){

res.status(500).json({

message:"Failed to fetch order booking parameter",
error

});

}

};


module.exports={

saveOrderBookingParameter,
getOrderBookingParameter

};