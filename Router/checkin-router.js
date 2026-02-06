const express = require("express");
const router = express.Router();
const authMiddleware = require("../MIddlewares/authMiddleware");
const checkinController = require("../Controllers/checkin-controller");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");

// POST → Create Checkin
router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.FRONT_OFFICE.WALKIN_CHECKIN.section,
    PERMISSIONS.FRONT_OFFICE.WALKIN_CHECKIN.screen,
    "insert"
  ), checkinController.createCheckin);

// GET → Logged in user ka data
router.get("/my-checkins", authMiddleware,  checkPermission(
    PERMISSIONS.FRONT_OFFICE.WALKIN_CHECKIN.section,
    PERMISSIONS.FRONT_OFFICE.WALKIN_CHECKIN.screen,
    "view"
  ),checkinController.getCheckinsForUser);
router.post("/:folioNo/advance-charge", authMiddleware,checkPermission(
    PERMISSIONS.FRONT_OFFICE.WALKIN_CHECKIN.section,
    PERMISSIONS.FRONT_OFFICE.WALKIN_CHECKIN.screen,
    "insert"
  ), checkinController.addAdvanceCharge);

router.get("/:folioNo/advance-charge", authMiddleware,checkPermission(
    PERMISSIONS.FRONT_OFFICE.WALKIN_CHECKIN.section,
    PERMISSIONS.FRONT_OFFICE.WALKIN_CHECKIN.screen,
    "view"
  ), checkinController.getAdvanceChargesByFolio);
router.post("/:folioNo/room-inclusions",authMiddleware,checkinController.addAdvanceCharge)
router.put(
  "/mark-bill-generated/:id",
  authMiddleware,
  checkinController.markBillGenerated
);
router.post("/generate-bill/:id",authMiddleware, checkinController.generateBill);
router.post(
  "/cancel-bill/:id",
  authMiddleware,
  checkinController.cancelBill
);
router.post(
  "/settle-bill/:id",
  authMiddleware,
  checkinController.settleBill
);

module.exports = router;
