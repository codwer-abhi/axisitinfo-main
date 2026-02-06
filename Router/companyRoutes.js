const express = require("express");
const router = express.Router();

const {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany
} = require("../Controllers/companyController");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.COMPANY_MASTER.section,
    PERMISSIONS.MAIN_SETUP.COMPANY_MASTER.screen,
    "insert"
  ), createCompany);
router.get("/list", authMiddleware,checkPermission(
    PERMISSIONS.MAIN_SETUP.COMPANY_MASTER.section,
    PERMISSIONS.MAIN_SETUP.COMPANY_MASTER.screen,
    "view"
  ), getCompanies);
router.put("/update/:id", authMiddleware,checkPermission(
  PERMISSIONS.MAIN_SETUP.COMPANY_MASTER.section,
    PERMISSIONS.MAIN_SETUP.COMPANY_MASTER.screen,
    "edit"
  ), updateCompany);
router.delete("/delete/:id", authMiddleware,checkPermission(
  PERMISSIONS.MAIN_SETUP.COMPANY_MASTER.section,
    PERMISSIONS.MAIN_SETUP.COMPANY_MASTER.screen,
    "delete"
  ), deleteCompany);

module.exports = router;
