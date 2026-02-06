const express = require("express");
const router = express.Router();

const {
  createSundry,
  getSundryList,
  updateSundry,
  deleteSundry
} = require("../Controllers/sundryMasterController");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.SUNDRY_MASTER.section,
    PERMISSIONS.MAIN_SETUP.SUNDRY_MASTER.screen,
    "insert"
  ), createSundry);
router.get("/list", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.SUNDRY_MASTER.section,
    PERMISSIONS.MAIN_SETUP.SUNDRY_MASTER.screen,
    "view"
  ), getSundryList);
router.put("/update/:id", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.SUNDRY_MASTER.section,
    PERMISSIONS.MAIN_SETUP.SUNDRY_MASTER.screen,
    "edit"
  ), updateSundry);
router.delete("/delete/:id", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.SUNDRY_MASTER.section,
    PERMISSIONS.MAIN_SETUP.SUNDRY_MASTER.screen,
    "delete"
  ), deleteSundry);

module.exports = router;
