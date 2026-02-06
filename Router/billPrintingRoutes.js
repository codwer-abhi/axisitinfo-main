const express = require("express");
const router = express.Router();

const {
  createBillPrinting,
  getBillPrintingList,
  updateBillPrinting,
  deleteBillPrinting
} = require("../Controllers/billPrintingController");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.section,
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.screen,
    "insert"
  ), createBillPrinting);
router.get("/",authMiddleware, checkPermission(
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.section,
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.screen,
    "view"
  ), getBillPrintingList);
router.put("/:id",authMiddleware, checkPermission(
  PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.section,
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.screen,
    "edit"
  ),  updateBillPrinting);
router.delete("/:id", authMiddleware, checkPermission(
  PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.section,
    PERMISSIONS.MAIN_SETUP.PRINTING_SETUP.screen,
    "delete"
  ), deleteBillPrinting);

module.exports = router;
