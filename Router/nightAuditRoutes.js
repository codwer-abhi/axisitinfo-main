const express = require("express");
const router = express.Router();
const { chargePosting } = require("../Controllers/nightAuditController");
const authMiddleware = require("../MIddlewares/authMiddleware");
const {runNightAudit,getBusinessDate}=require("../Controllers/nightauditdatecontroller")
router.post("/night-audit/charge-posting", authMiddleware, chargePosting);
router.post("/night-audit", authMiddleware, runNightAudit);
router.get("/night-audit/business-date", authMiddleware, getBusinessDate);
module.exports = router;
