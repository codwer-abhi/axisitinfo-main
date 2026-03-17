const RewardPoint = require("../Models/RewardPoint");
const Registereduser = require("../Models/User");


// ================= CREATE =================

const createRewardPoint = async(req,res)=>{

try{

const hotelCode = req.hotelId;
const userId = req.userId;

const {
schemeName,
category,
pointsOnAmount,
points,
perPointValue,
lowerLimit,
comparison,
upperLimit
} = req.body;


// validation

if(!schemeName || !category){

return res.status(400).json({

message:"Scheme Name and Category required"

});

}


// hotel validation

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({

message:"Invalid Hotel Code"

});

}


// create

const reward = await RewardPoint.create({

hotelId:hotel._id,
hotelCode:hotelCode,
createdBy:userId,
createdByModel:req.loginType === "OWNER" ? "User" : "UserMaster",

schemeName,
category,
pointsOnAmount,
points,
perPointValue,
lowerLimit,
comparison,
upperLimit

});


res.status(201).json({

message:"Reward point created successfully",
data:reward

});


}catch(error){

res.status(500).json({

message:"Failed to create reward point",
error

});

}

};




// ================= LIST =================

const getRewardPoints = async(req,res)=>{

try{

const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({

message:"Invalid Hotel Code"

});

}

const rewards = await RewardPoint.find({

hotelId:hotel._id

})

.populate("createdBy","username")
.sort({schemeName:1});


res.status(200).json({

message:"Reward points list",
data:rewards

});


}catch(error){

res.status(500).json({

message:"Failed to fetch reward points",
error

});

}

};




// ================= UPDATE =================

const updateRewardPoint = async(req,res)=>{

try{

const {id} = req.params;
const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({

message:"Invalid Hotel Code"

});

}

const updated = await RewardPoint.findOneAndUpdate(

{_id:id,hotelId:hotel._id},

req.body,

{new:true}

);


if(!updated){

return res.status(404).json({

message:"Reward point not found"

});

}

res.status(200).json({

message:"Reward point updated",
data:updated

});

}catch(error){

res.status(500).json({

message:"Failed to update reward point",
error

});

}

};




// ================= DELETE =================

const deleteRewardPoint = async(req,res)=>{

try{

const {id} = req.params;
const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){

return res.status(404).json({

message:"Invalid Hotel Code"

});

}

const deleted = await RewardPoint.findOneAndDelete({

_id:id,
hotelId:hotel._id

});


if(!deleted){

return res.status(404).json({

message:"Reward point not found"

});

}


res.status(200).json({

message:"Reward point deleted successfully"

});


}catch(error){

res.status(500).json({

message:"Failed to delete reward point",
error

});

}

};


module.exports = {

createRewardPoint,
getRewardPoints,
updateRewardPoint,
deleteRewardPoint

};