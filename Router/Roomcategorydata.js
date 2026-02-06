const express =require("express");
const authMiddleware = require("../MIddlewares/authMiddleware.js"); 
const { getRoomCategories } = require("../Controllers/roomCategoryController.js");
const router = express.Router();
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
router.get("/room-category", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.section,
    PERMISSIONS.MAIN_SETUP.ROOM_CATEGORY.screen,
    "view"
  ), getRoomCategories);
module.exports = router;