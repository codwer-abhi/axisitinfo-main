const express = require("express");
const router = express.Router();

const {
  createVoucherFormula,
  getVoucherFormulas,
  updateVoucherFormula,
  deleteVoucherFormula
} = require("../Controllers/voucherFormulaController");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/create", authMiddleware, createVoucherFormula);
router.get("/", authMiddleware, getVoucherFormulas);
router.put("/update/:id", authMiddleware, updateVoucherFormula);
router.delete("/:id", authMiddleware, deleteVoucherFormula);

module.exports = router;
