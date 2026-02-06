const express = require("express");
const router = express.Router();
const { saveGeneralParameters, getGeneralParameters } = require("../Controllers/generalParameterController.js");
const authMiddleware = require("../MIddlewares/authMiddleware.js"); // hotelCode + userId extract
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
router.post("/general-parameters", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "insert"
  ), saveGeneralParameters);
router.get("/general-parameters", authMiddleware,checkPermission(
       PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "view"
  ), getGeneralParameters);

module.exports = router;
