const express = require("express");
const { saveInstructions, getInstructions } =require("../Controllers/instructionController.js");
const authMiddleware =require( "../MIddlewares/authMiddleware.js");   // contains hotelCode + userId inject
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const router = express.Router();

router.post("/save", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "insert"
  ), saveInstructions);
router.get("/get", authMiddleware,checkPermission(
  PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "view"
  ), getInstructions);

module.exports = router;
