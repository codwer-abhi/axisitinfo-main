const express = require('express');
const router = express.Router();
const authMiddleware = require('../MIddlewares/authMiddleware.js');
const { handleuser } = require('../Controllers/auth-controller.js');
const signupschema=require('../validators/auth-validator.js')
const validate=require('../MIddlewares/validate-middleware.js')
const { handlehome, handleregister,handleLogin} = require('../Controllers/auth-controller');
const loginschema = require('../validators/auth-validatorlogin.js');
router.get('/',handlehome);
router.post('/register',validate(signupschema) ,handleregister); 
router.post('/login',validate(loginschema),handleLogin);
router.get('/user',authMiddleware, handleuser);
module.exports = router;