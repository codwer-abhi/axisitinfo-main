const express = require("express");
const router = express.Router();
const {
  createGroupAccount,
  getGroupAccounts,
  updateGroupAccount,
  deleteGroupAccount,
} = require("../Controllers/groupAccount.controller");
const {checkPermission}=require("../MIddlewares/Permissionmiddleware");
const PERMISSIONS = require("../config/permissions.config");
const authMiddleware = require("../MIddlewares/authMiddleware.js"); // hotelCode + userId extract


router.post("/create", authMiddleware,checkPermission(
    PERMISSIONS.FINANCE.GROUP_ACCOUNT.section,
    PERMISSIONS.FINANCE.GROUP_ACCOUNT.screen,
    "insert"
  ), createGroupAccount);
router.get("/list", authMiddleware,checkPermission(
    PERMISSIONS.FINANCE.GROUP_ACCOUNT.section,
    PERMISSIONS.FINANCE.GROUP_ACCOUNT.screen,
    "view"
  ), getGroupAccounts);
router.put("/update/:id", authMiddleware,checkPermission(
     PERMISSIONS.FINANCE.GROUP_ACCOUNT.section,
    PERMISSIONS.FINANCE.GROUP_ACCOUNT.screen,
    "edit"
  ), updateGroupAccount);
router.delete("/delete/:id", authMiddleware,checkPermission(
    PERMISSIONS.FINANCE.GROUP_ACCOUNT.section,
    PERMISSIONS.FINANCE.GROUP_ACCOUNT.screen,
    "delete"
  ), deleteGroupAccount);

module.exports = router;
