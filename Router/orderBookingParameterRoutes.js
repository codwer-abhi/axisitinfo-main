const express = require("express");
const router = express.Router();

const {

saveOrderBookingParameter,
getOrderBookingParameter

} = require("../Controllers/orderBookingParameterController");

const authMiddleware = require("../MIddlewares/authMiddleware");


router.post("/",authMiddleware,saveOrderBookingParameter);

router.get("/",authMiddleware,getOrderBookingParameter);


module.exports = router;