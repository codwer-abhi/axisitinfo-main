// Routes/userMaster.routes.js
const express = require("express");
const router = express.Router();

const {
  createUserMaster,
  getUserMasters,
  updateUserMaster,
  toggleUserStatus
} = require("../Controllers/userMaster.controller.js");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware.js");
router.post("/", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.USER_MASTER.section,
    PERMISSIONS.MAIN_SETUP.USER_MASTER.screen,
    "insert"
  ), createUserMaster);
router.get("/", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.USER_MASTER.section,
    PERMISSIONS.MAIN_SETUP.USER_MASTER.screen,
    "view"
  ), getUserMasters);
router.put("/:id", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.USER_MASTER.section,
    PERMISSIONS.MAIN_SETUP.USER_MASTER.screen,
    "edit"
  ), updateUserMaster);      // 🔥 UPDATE
router.patch("/:userId/status", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.USER_MASTER.section,
    PERMISSIONS.MAIN_SETUP.USER_MASTER.screen,
    "edit"
  ), toggleUserStatus);

module.exports = router;
