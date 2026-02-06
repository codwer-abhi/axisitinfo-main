const express = require("express");
const router = express.Router();

const {
  createCity,
  getCities,
  updateCity,
  deleteCity
} = require("../Controllers/CityController");

const authMiddleware = require("../MIddlewares/authMiddleware");

// 🔐 All routes secured
router.post("/create", authMiddleware, createCity);
router.get("/list", authMiddleware, getCities);
router.put("/update/:id", authMiddleware, updateCity);
router.delete("/delete/:id", authMiddleware, deleteCity);

module.exports = router;
