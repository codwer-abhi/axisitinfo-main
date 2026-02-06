const express = require("express");
const router = express.Router();

const { closeFinancialYear } = require("../Controllers/FinancialYear.controller");
const authMiddleware = require("../MIddlewares/authMiddleware");
// 🔐 Admin only
router.post(
  "/close",
  authMiddleware,
  closeFinancialYear
);

module.exports = router;
