const express = require("express");
const router = express.Router();
const {
  createCountry,
  getCountries,
  updateCountry,
  deleteCountry
} = require("../Controllers/countryController");

const authMiddleware = require("../MIddlewares/authMiddleware");

router.post("/", authMiddleware, createCountry);
router.get("/", authMiddleware, getCountries);
router.put("/:id", authMiddleware, updateCountry);
router.delete("/:id", authMiddleware, deleteCountry);

module.exports = router;
