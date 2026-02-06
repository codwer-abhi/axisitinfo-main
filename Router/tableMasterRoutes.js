const express = require("express");
const router = express.Router();
const auth = require("../MIddlewares/authMiddleware");

const {
  createTable,
  getTables,
  updateTable,
  deleteTable
} = require("../Controllers/tableMasterController");

router.post("/create", auth, createTable);
router.get("/list", auth, getTables);
router.put("/update/:id", auth, updateTable);
router.delete("/delete/:id", auth, deleteTable);

module.exports = router;
