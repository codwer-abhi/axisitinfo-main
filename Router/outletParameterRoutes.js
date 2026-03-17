const express = require("express");
const router = express.Router();

const {
saveOutletParameter,
getOutletParameter
} = require("../Controllers/outletParameterController");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/",authMiddleware,saveOutletParameter);

router.get("/",authMiddleware,getOutletParameter);

module.exports = router;