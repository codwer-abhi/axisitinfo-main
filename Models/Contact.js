const mongoose = require('mongoose');
const contactschema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
         type:String,
        require:true
    },
    phone:{
         type:String,
        require:true
    },
    select:{
         type:String,
         enum:  [
      'SOFTWARE',
      'HOTEL',
      'RESTAURANT',
      'BAR',
      'MALL',
      'HOSPITAL',
      'SCHOOL',
      'RESORT',
      'WATER PARK'
    ],
        require:true
    },
    message:{
        type:String,
        require:true
    }
})
const Contact=mongoose.model('contact',contactschema);
module.exports=Contact