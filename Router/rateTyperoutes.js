const express = require("express");
const router = express.Router();
const { saveRateType, getRateType } = require("../Controllers/rateTypecontroller.js");
const authMiddleware = require("../MIddlewares/authMiddleware.js");  // your token middleware
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
router.post("/save", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "insert"
  ), saveRateType);
router.get("/get", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "view"
  ), getRateType);

module.exports = router;
