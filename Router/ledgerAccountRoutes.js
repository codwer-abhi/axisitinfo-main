const router = require("express").Router();
const authMiddleware =require( "../MIddlewares/authMiddleware.js");   // contains hotelCode + userId inject
const ledgerCtrl = require("../Controllers/ledgerAccountController.js");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.FINANCE.LEDGER_ACCOUNT.section,
    PERMISSIONS.FINANCE.LEDGER_ACCOUNT.screen,
    "insert"
  ), ledgerCtrl.createLedgerAccount);
router.get("/list", authMiddleware,checkPermission(
   PERMISSIONS.FINANCE.LEDGER_ACCOUNT.section,
    PERMISSIONS.FINANCE.LEDGER_ACCOUNT.screen,
    "view"
  ), ledgerCtrl.getLedgerAccounts);
router.put("/update/:id", authMiddleware,checkPermission(
   PERMISSIONS.FINANCE.LEDGER_ACCOUNT.section,
    PERMISSIONS.FINANCE.LEDGER_ACCOUNT.screen,
    "edit"
  ), ledgerCtrl.updateLedgerAccount);
router.delete("/delete/:id", authMiddleware,checkPermission(
   PERMISSIONS.FINANCE.LEDGER_ACCOUNT.section,
    PERMISSIONS.FINANCE.LEDGER_ACCOUNT.screen,
    "delete"
  ), ledgerCtrl.deleteLedgerAccount);

module.exports = router;
