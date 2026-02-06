const express = require("express");
const router = express.Router();
const auth = require("../MIddlewares/authMiddleware");

const {
  createTaxStructure,
  getTaxStructures,
  deleteTaxStructure,
  updateTaxStructure    
} = require("../Controllers/taxStructureController");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");

router.post("/create", auth,checkPermission(
    PERMISSIONS.MAIN_SETUP.TAX_STRUCTURE.section,
    PERMISSIONS.MAIN_SETUP.TAX_STRUCTURE.screen,
    "insert"
  ), createTaxStructure);
router.get("/list", auth,checkPermission(
     PERMISSIONS.MAIN_SETUP.TAX_STRUCTURE.section,
    PERMISSIONS.MAIN_SETUP.TAX_STRUCTURE.screen,
    "view"
  ), getTaxStructures);
router.delete("/delete/:id", auth,checkPermission(
  PERMISSIONS.MAIN_SETUP.TAX_STRUCTURE.section,
    PERMISSIONS.MAIN_SETUP.TAX_STRUCTURE.screen,
    "delete"
  ), deleteTaxStructure);
router.put("/update/:id", auth,checkPermission(
  PERMISSIONS.MAIN_SETUP.TAX_STRUCTURE.section,
    PERMISSIONS.MAIN_SETUP.TAX_STRUCTURE.screen,
    "edit"
  ), updateTaxStructure);
module.exports = router;
