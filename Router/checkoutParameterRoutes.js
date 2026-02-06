const express = require("express");
const router = express.Router();

const {
  saveCheckoutParameter,
  getCheckoutParameter
} = require("../Controllers/checkoutParameterController");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");

const authMiddleware = require("../MIddlewares/authMiddleware.js"); // hotelCode + userId extract
// protected routes
router.post("/save", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "insert"
  ), saveCheckoutParameter);
router.get("/get",checkPermission(
  PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.section,
    PERMISSIONS.MAIN_SETUP.FORM_PARAMETER.screen,
    "view"
  ), authMiddleware, getCheckoutParameter);

module.exports = router;
