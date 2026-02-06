const express = require("express");
const router = express.Router();

const {
  saveUserPermission,
  getUserPermissions,
  getUsersForPermission
} = require("../Controllers/userPermission.controller");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware");

// 🔐 all routes protected
router.post("/", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.USER_PERMISSION.section,
    PERMISSIONS.MAIN_SETUP.USER_PERMISSION.screen,
    "insert"
  ), saveUserPermission);   // Submit
router.get("/", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.USER_PERMISSION.section,
    PERMISSIONS.MAIN_SETUP.USER_PERMISSION.screen,
    "view"
  ), getUserPermissions);    // Grid
router.get("/users", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.USER_PERMISSION.section,
    PERMISSIONS.MAIN_SETUP.USER_PERMISSION.screen,
    "view"
  ), getUsersForPermission); // Username dropdown

module.exports = router; 
