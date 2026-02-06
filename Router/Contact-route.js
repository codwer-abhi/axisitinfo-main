const express = require('express');
const router = express.Router();
const {handlecontact}=require('../Controllers/contact-controller');
const contactschema =require('../validators/auth-validatorcontact.js');
const validate=require('../MIddlewares/validate-middleware.js')
router.post('/',validate(contactschema),handlecontact)
module.exports=router