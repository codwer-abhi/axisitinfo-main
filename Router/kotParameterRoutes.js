const express = require("express");
const router = express.Router();

const {
saveKOTParameter,
getKOTParameter
} = require("../Controllers/kotParameterController");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/",authMiddleware,saveKOTParameter);

router.get("/",authMiddleware,getKOTParameter);

module.exports = router;