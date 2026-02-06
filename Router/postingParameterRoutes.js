const express = require("express");
const router = express.Router();

const {
  savePostingParameter,
  getPostingParameter
} = require("../Controllers/postingParameterController");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware.js"); // hotelCode + userId extract
// protected routes
router.post("/save", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "insert"
  ), savePostingParameter);
router.get("/get", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "view"
  ), getPostingParameter);

module.exports = router;
