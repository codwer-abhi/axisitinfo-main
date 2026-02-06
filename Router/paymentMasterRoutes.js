const express = require("express");
const router = express.Router();
const authMiddleware = require("../MIddlewares/authMiddleware");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const {
  createPaymentMaster,
  getPaymentMasters,
  updatePaymentMaster,
  deletePaymentMaster
} = require("../Controllers/paymentMasterController");

router.post("/", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.PAYMENT_TYPE.section,
    PERMISSIONS.MAIN_SETUP.PAYMENT_TYPE.screen,
    "insert"
  ), createPaymentMaster);
router.get("/", authMiddleware,checkPermission(
       PERMISSIONS.MAIN_SETUP.PAYMENT_TYPE.section,
    PERMISSIONS.MAIN_SETUP.PAYMENT_TYPE.screen,
    "view"
  ), getPaymentMasters);
router.put("/:id", authMiddleware,checkPermission(
     PERMISSIONS.MAIN_SETUP.PAYMENT_TYPE.section,
    PERMISSIONS.MAIN_SETUP.PAYMENT_TYPE.screen,
    "edit"
  ), updatePaymentMaster);
router.delete("/:id", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.PAYMENT_TYPE.section,
    PERMISSIONS.MAIN_SETUP.PAYMENT_TYPE.screen,
    "delete"
  ), deletePaymentMaster);

module.exports = router;
