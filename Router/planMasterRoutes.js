const express = require("express");
const {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan
} = require("../Controllers/planMasterController.js");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware.js");
const router = express.Router();

router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.PLAN_MASTER.section,
    PERMISSIONS.MAIN_SETUP.PLAN_MASTER.screen,
    "insert"
  ), createPlan);
router.get("/list", authMiddleware,checkPermission(
     PERMISSIONS.MAIN_SETUP.PLAN_MASTER.section,
    PERMISSIONS.MAIN_SETUP.PLAN_MASTER.screen,
    "view"
  ), getPlans);
router.put("/update/:id", authMiddleware,checkPermission(
      PERMISSIONS.MAIN_SETUP.PLAN_MASTER.section,
    PERMISSIONS.MAIN_SETUP.PLAN_MASTER.screen,
    "edit"
  ), updatePlan);
router.delete("/delete/:id", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.PLAN_MASTER.section,
    PERMISSIONS.MAIN_SETUP.PLAN_MASTER.screen,
    "delete"
  ), deletePlan);

module.exports = router;
