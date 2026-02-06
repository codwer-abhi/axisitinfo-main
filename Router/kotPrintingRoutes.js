const express = require("express");
const router = express.Router();

const {
  createKotPrinting,
  getKotPrintingList,
  updateKotPrinting,
  deleteKotPrinting
} = require("../Controllers/kotPrintingController");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.section,
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.screen,
    "insert"
  ), createKotPrinting);
router.get("/", authMiddleware,checkPermission(
     PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.section,
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.screen,
    "view"
  ), getKotPrintingList);
router.put("/:id", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.section,
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.screen,
    "edit"
  ), updateKotPrinting);
router.delete("/:id", authMiddleware,checkPermission(
       PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.section,
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.screen,
    "delete"
  ), deleteKotPrinting);

module.exports = router;
