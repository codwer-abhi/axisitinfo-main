const express = require("express");
const router = express.Router();

const {
  createUnit,
  getUnits,
  updateUnit,
  deleteUnit
} = require("../Controllers/UnitMasterController");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/create", authMiddleware, createUnit);
router.get("/list", authMiddleware, getUnits);
router.put("/update/:id", authMiddleware, updateUnit);
router.delete("/delete/:id", authMiddleware, deleteUnit);

module.exports = router;
