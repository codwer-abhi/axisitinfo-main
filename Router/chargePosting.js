const express = require("express");
const router = express.Router();
const { postChargeByFolio } = require("../Controllers/chargePostingController");
const auth = require("../MIddlewares/authMiddleware");

router.post("/post-charge/:folioNo", auth, postChargeByFolio);

module.exports = router;