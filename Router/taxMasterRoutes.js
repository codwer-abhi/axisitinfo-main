const express = require("express");
const router = express.Router();
const {
  createTax,
  getTaxes,
  updateTax,
  deleteTax
} = require("../Controllers/taxMasterController");
const authMiddleware = require("../MIddlewares/authMiddleware");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.TAX_MASTER.section,
    PERMISSIONS.MAIN_SETUP.TAX_MASTER.screen,
    "insert"
  ), createTax);
router.get("/list",authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.TAX_MASTER.section,
    PERMISSIONS.MAIN_SETUP.TAX_MASTER.screen,
    "view"
  ), getTaxes);
router.put("/update/:id", authMiddleware, checkPermission(
    PERMISSIONS.MAIN_SETUP.TAX_MASTER.section,
    PERMISSIONS.MAIN_SETUP.TAX_MASTER.screen,
    "edit"
  ),updateTax);
router.delete("/delete/:id",authMiddleware, checkPermission(
    PERMISSIONS.MAIN_SETUP.TAX_MASTER.section,
    PERMISSIONS.MAIN_SETUP.TAX_MASTER.screen,
    "delete"
  ), deleteTax);

module.exports = router;
