const express = require("express");
const router = express.Router();
const auth = require("../MIddlewares/authMiddleware");

const {
  createMenuCategory,
  getMenuCategories,
  updateMenuCategory,
  deleteMenuCategory
} = require("../Controllers/menuCategoryController");

router.post("/create", auth, createMenuCategory);
router.get("/", auth, getMenuCategories);
router.put("/update/:id", auth, updateMenuCategory);
router.delete("/:id", auth, deleteMenuCategory);

module.exports = router;
