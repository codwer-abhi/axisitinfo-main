const express =require("express");
const upload = require("../MIddlewares/uploadImages.js");
const authMiddleware = require("../MIddlewares/authMiddleware.js");  // your token middleware
const  {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom
} = require("../Controllers/roomMasterController.js");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const router = express.Router();
router.post("/create", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_MASTER.section,
      PERMISSIONS.MAIN_SETUP.ROOM_MASTER.screen,
      "insert"
    ), upload.single("photo"), createRoom);
router.get("/list", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_MASTER.section,
      PERMISSIONS.MAIN_SETUP.ROOM_MASTER.screen,
      "view"
    ), getRooms);
router.put("/:id", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_MASTER.section,
      PERMISSIONS.MAIN_SETUP.ROOM_MASTER.screen,
      "edit"
    ), upload.single("photo"), updateRoom);
router.delete("/:id", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_MASTER.section,
      PERMISSIONS.MAIN_SETUP.ROOM_MASTER.screen,
      "delete"
    ), deleteRoom);
module.exports = router;            