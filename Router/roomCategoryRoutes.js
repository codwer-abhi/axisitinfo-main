const express =require("express");
const upload = require("../MIddlewares/uploadImages.js");
const authMiddleware = require("../MIddlewares/authMiddleware.js");  // your token middleware
const  {
  createRoomCategory,
  getRoomCategories,
  updateRoomCategory,
  deleteRoomCategory
} = require("../Controllers/roomCategoryController.js");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const router = express.Router();

router.post(
  "/create",
  authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.section,
      PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.screen,
      "insert"
    ),
  upload.array("images", 10),   // ⭐ Cloudinary Upload
  createRoomCategory
);

router.get("/list", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.section,
    PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.screen,
    "view"
  ), getRoomCategories);
router.put("/update/:id", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.section,
    PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.screen,
    "edit"
  ), upload.array("images", 10), updateRoomCategory);
router.delete("/delete/:id", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.section,
    PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.screen,
    "delete"
  ), deleteRoomCategory);

module.exports = router;