const express = require("express");
const {
  createGuestStatus,
  getGuestStatus,
  updateGuestStatus,
  deleteGuestStatus
} = require("../Controllers/guestStatusController.js");
const authMiddleware=require("../MIddlewares/authMiddleware.js");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const router = express.Router();

router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.GUEST_STATUS.section,
    PERMISSIONS.MAIN_SETUP.GUEST_STATUS.screen,
    "insert"
  ), createGuestStatus);
router.get("/list", authMiddleware,checkPermission(
     PERMISSIONS.MAIN_SETUP.GUEST_STATUS.section,
    PERMISSIONS.MAIN_SETUP.GUEST_STATUS.screen,
    "view"
  ), getGuestStatus);
router.put("/update/:id", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.GUEST_STATUS.section,
    PERMISSIONS.MAIN_SETUP.GUEST_STATUS.screen,
    "edit"
  ), updateGuestStatus);
router.delete("/delete/:id", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.GUEST_STATUS.section,
    PERMISSIONS.MAIN_SETUP.GUEST_STATUS.screen,
    "delete"
  ), deleteGuestStatus);

module.exports = router;
