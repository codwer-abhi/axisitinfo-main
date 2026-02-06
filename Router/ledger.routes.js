const express = require("express");
const router = express.Router();

const {
  createLedger,
  getLedgers,
  updateLedger,
  deleteLedger
} = require("../Controllers/ledger.controller");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/create", authMiddleware, createLedger);
router.get("/list", authMiddleware, getLedgers);
router.put("/update/:id", authMiddleware, updateLedger);
router.delete("/delete/:id", authMiddleware, deleteLedger);

module.exports = router;
