const express = require("express");
const {
  createRoomFeature,
  getRoomFeatures,
  updateRoomFeature,
  deleteRoomFeature,
} = require("../Controllers/roomFeatureController.js");
const authMiddleware = require("../MIddlewares/authMiddleware.js");  // your token middleware
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const router = express.Router();

router.post("/create",authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_FEATURES.section,
      PERMISSIONS.MAIN_SETUP.ROOM_FEATURES.screen,
      "insert"
    ), createRoomFeature);
router.get("/list",authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_FEATURES.section,
      PERMISSIONS.MAIN_SETUP.ROOM_FEATURES.screen,
      "view"
    ), getRoomFeatures);
router.put("/update/:id", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_FEATURES.section,
      PERMISSIONS.MAIN_SETUP.ROOM_FEATURES.screen,
      "edit"
    ), updateRoomFeature);
router.delete("/delete/:id", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_FEATURES.section,
      PERMISSIONS.MAIN_SETUP.ROOM_FEATURES.screen,
      "delete"
    ), deleteRoomFeature);

module.exports = router;
