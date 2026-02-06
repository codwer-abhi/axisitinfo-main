const express = require('express');
const {
  createBusinessSource,
  getBusinessSources,
    updateBusinessSource,
    deleteBusinessSource
} = require("../Controllers/businessSourceController.js");
const authMiddleware =require("../MIddlewares/authMiddleware.js");
const PERMISSIONS = require("../config/permissions.config");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const router = express.Router();

// hotelCode + userId middleware 
router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.BUSINESS_SOURCE.section,
    PERMISSIONS.MAIN_SETUP.BUSINESS_SOURCE.screen,
    "insert"
  ), createBusinessSource);
router.get("/list", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.BUSINESS_SOURCE.section,
    PERMISSIONS.MAIN_SETUP.BUSINESS_SOURCE.screen,
    "view"
  ), getBusinessSources);
router.put("/update/:id",authMiddleware,checkPermission(
     PERMISSIONS.MAIN_SETUP.BUSINESS_SOURCE.section,
    PERMISSIONS.MAIN_SETUP.BUSINESS_SOURCE.screen,
    "edit"
  ), updateBusinessSource);
router.delete("/delete/:id",authMiddleware,checkPermission(
   PERMISSIONS.MAIN_SETUP.BUSINESS_SOURCE.section,
    PERMISSIONS.MAIN_SETUP.BUSINESS_SOURCE.screen,
    "delete"
  ), deleteBusinessSource);

module.exports = router;