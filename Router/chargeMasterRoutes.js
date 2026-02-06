const express = require("express");
const {
  createCharge,
  getCharges,
  updateCharge,
  deleteCharge,
} = require("../Controllers/chargeMasterController.js");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware.js");

const router = express.Router();

router.post("/create", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.CHARGE_MASTER.section,
    PERMISSIONS.MAIN_SETUP.CHARGE_MASTER.screen,
    "insert"
  ), createCharge);
router.get("/list",authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.CHARGE_MASTER.section,
    PERMISSIONS.MAIN_SETUP.CHARGE_MASTER.screen,
    "view"
  ), getCharges);
router.put("/update/:id", authMiddleware,checkPermission(
  PERMISSIONS.MAIN_SETUP.CHARGE_MASTER.section,
    PERMISSIONS.MAIN_SETUP.CHARGE_MASTER.screen,
    "edit"
  ), updateCharge);
router.delete("/delete/:id",authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.CHARGE_MASTER.section,
    PERMISSIONS.MAIN_SETUP.CHARGE_MASTER.screen,
    "delete"
  ), deleteCharge);

module.exports = router;