const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const userschema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            unique:true
        },
        phone:{
            type:String,
            require:true,
        },
        password:{
            type:String,
            required:true
        },
        isAdmin:{
            type:Boolean,
            default:false
        }
    },
      {timestamps:true}
);
userschema.pre('save',async function(next){
    const user=this;
    if(!user.isModified("password")){
        next();
    }
    try{
        const saltRound=await bcrypt.genSalt(10);
     const hash_password=await bcrypt.hash(user.password,saltRound)
    user.password=hash_password
    }catch(error){
        next(error)
    }
})
// JWT
    userschema.methods.generateToken=async function(){
        try{
            return jwt.sign(
                {
                    userid:this._id.toString(),
                    email:this.email,
                    isAdmin:this.isAdmin,   
                },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn:"30d",
                }
            )
        }catch(error){
            console.log(error);
            
        }
    };
const User=mongoose.model('axisitinfo',userschema);
module.exports=User;