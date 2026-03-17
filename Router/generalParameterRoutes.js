const express = require("express");
const router = express.Router();

const {
  saveGeneralParameterpos,
  getGeneralParameterpos
} = require("../Controllers/generalParameterposController");

const authMiddleware = require("../MIddlewares/authMiddleware");


router.post("/", authMiddleware, saveGeneralParameterpos);
router.get("/", authMiddleware, getGeneralParameterpos);

module.exports = router;