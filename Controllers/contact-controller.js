const Contact=require('../Models/Contact.js');
const handlecontact=async(req,res)=>{
    try{
        const contactdata=req.body;
        
        await Contact.create(contactdata)
        res.json({message:'data stored in database'});
    }catch(err){
        res.status(400).json(err);
    }
}
module.exports={handlecontact}