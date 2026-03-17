const NcType = require("../Models/NcType");
const Registereduser = require("../Models/User");


// ================= CREATE =================
const createNcType = async (req,res)=>{
try{

const hotelCode = req.hotelId;
const userId = req.userId;

const {name,percentage} = req.body;

if(!name || !percentage){
return res.status(400).json({
message:"All fields are required"
});
}

// Hotel validation
const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){
return res.status(404).json({
message:"Invalid Hotel Code"
});
}

// Duplicate check
const exists = await NcType.findOne({
hotelId:hotel._id,
name
});

if(exists){
return res.status(409).json({
message:"NC Type already exists"
});
}

const ncType = await NcType.create({

hotelId:hotel._id,
hotelCode:hotelCode,
createdBy:userId,
createdByModel:req.loginType === "OWNER" ? "User" : "UserMaster",
name,
percentage

});

res.status(201).json({
message:"NC Type created successfully",
data:ncType
});

}catch(error){

res.status(500).json({
message:"Failed to create NC Type",
error
});

}
};



// ================= LIST =================
const getNcTypes = async (req,res)=>{

try{

const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){
return res.status(404).json({
message:"Invalid Hotel Code"
});
}

const ncTypes = await NcType.find({

hotelId:hotel._id

})
.populate("createdBy","username")
.sort({name:1});

res.status(200).json({
message:"NC Type list",
data:ncTypes
});

}catch(error){

res.status(500).json({
message:"Failed to fetch NC Type",
error
});

}

};



// ================= UPDATE =================
const updateNcType = async (req,res)=>{

try{

const {id} = req.params;
const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){
return res.status(404).json({
message:"Invalid Hotel Code"
});
}

const updated = await NcType.findOneAndUpdate(

{_id:id,hotelId:hotel._id},
req.body,
{new:true}

);

if(!updated){
return res.status(404).json({
message:"NC Type not found"
});
}

res.status(200).json({
message:"NC Type updated successfully",
data:updated
});

}catch(error){

res.status(500).json({
message:"Failed to update NC Type",
error
});

}

};



// ================= DELETE =================
const deleteNcType = async (req,res)=>{

try{

const {id} = req.params;
const hotelCode = req.hotelId;

const hotel = await Registereduser.findOne({hotelCode});

if(!hotel){
return res.status(404).json({
message:"Invalid Hotel Code"
});
}

const deleted = await NcType.findOneAndDelete({

_id:id,
hotelId:hotel._id

});

if(!deleted){
return res.status(404).json({
message:"NC Type not found"
});
}

res.status(200).json({
message:"NC Type deleted successfully"
});

}catch(error){

res.status(500).json({
message:"Failed to delete NC Type",
error
});

}

};


module.exports={

createNcType,
getNcTypes,
updateNcType,
deleteNcType

};