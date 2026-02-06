const User =require('../Models/auth-model')
const bcrypt=require('bcryptjs')
async function handlehome(req,res){
    try{
  res.status(200).json({
    message: 'Welcome to the home page',
  });
} catch (error) {
  res.status(500).json({
    message: 'An error occurred while processing your request',
    error: error.message,
  });
}
}
async function handleregister(req, res) {
    try{
      const {username,email,phone,password} = req.body
      const userexist= await User.findOne({
        email:email,
      });
      if(userexist){
        return res.status(400).json({msg:'email already exist'})
      }
    //  const saltRound=10;
   //   const hash_password=await bcrypt.hash(password,saltRound)
     const table_data = await User.create(
      {
        username,
        phone,
        email,
        password,
      }
    );
  res.status(200).json({
    message: 'rsgistration succesfull',
    token:await table_data.generateToken(),
    userid:table_data._id.toString()
  });
} catch (error) {
  res.status(500).json({
    message: 'An error occurred while processing your request',
    error: error.message,
  });
}
}
async function handleLogin(req, res) {
  try{
    const{email,password}=req.body;
    const userexist= await User.findOne({
       email: email,
    });
    if(!userexist){
       return res.status(400).json({msg:'user not exist'})
    }
      const user=await bcrypt.compare(password,userexist.password);
      if(!user){
        return res.status(400).json({msg:'invalid credentials'});
      }
      res.status(200).json({
    message: 'Login succesfull',
    token:await userexist.generateToken(),
    userid:userexist._id.toString()
  });
  }catch(error){
    console.log(error);
    
  }
  }
   async function handleuser(req, res) {
    try{
      const userData= req.user;
      res.status(200).json({
        message: 'User data retrieved successfully',
        data: userData
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while processing your request',
        error: error.message,
      });
    }
}
module.exports = {
  handlehome,
  handleregister,
  handleLogin,
  handleuser
};