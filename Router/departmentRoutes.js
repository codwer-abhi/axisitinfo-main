const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment
} = require("../Controllers/DepartmentController");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/create",authMiddleware,  createDepartment);
router.get("/list", authMiddleware, getDepartments);
router.put("/update/:id", authMiddleware, updateDepartment);
router.delete("/delete/:id", authMiddleware, deleteDepartment);

module.exports = router;
