const express = require("express");
const { 
  createBookingSource,
  getBookingSources,
  updateBookingSource,
  deleteBookingSource
} = require("../Controllers/BookingSourceController.js");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware =require("../MIddlewares/authMiddleware.js");


const router = express.Router();

router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.BOOKING_SOURCE.section,
    PERMISSIONS.MAIN_SETUP.BOOKING_SOURCE.screen,
    "insert"
  ), createBookingSource);
router.get("/list",authMiddleware, checkPermission(
    PERMISSIONS.MAIN_SETUP.BOOKING_SOURCE.section,
    PERMISSIONS.MAIN_SETUP.BOOKING_SOURCE.screen,
    "view"
  ),getBookingSources);
router.put("/update/:id", authMiddleware,checkPermission(
   PERMISSIONS.MAIN_SETUP.BOOKING_SOURCE.section,
    PERMISSIONS.MAIN_SETUP.BOOKING_SOURCE.screen,
    "edit"
  ), updateBookingSource);
router.delete("/delete/:id", authMiddleware,checkPermission(
  PERMISSIONS.MAIN_SETUP.BOOKING_SOURCE.section,
    PERMISSIONS.MAIN_SETUP.BOOKING_SOURCE.screen,
    "delete"
  ), deleteBookingSource);

module.exports = router;
