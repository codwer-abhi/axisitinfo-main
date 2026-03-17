const express = require("express");
const router = express.Router();

const {
  createMealTime,
  getMealTimes,
  updateMealTime,
  deleteMealTime
} = require("../Controllers/MealTimeController");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/create", authMiddleware, createMealTime);
router.get("/list", authMiddleware, getMealTimes);
router.put("/update/:id", authMiddleware, updateMealTime);
router.delete("/delete/:id", authMiddleware, deleteMealTime);

module.exports = router;