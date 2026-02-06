const express = require("express");
const router = express.Router();
const auth = require("../MIddlewares/authMiddleware");

const {
  createItemGroup,
  getItemGroups,
  updateItemGroup,
  deleteItemGroup
} = require("../Controllers/itemGroupController");

router.post("/create", auth, createItemGroup);
router.get("/", auth, getItemGroups);
router.put("/update/:id", auth, updateItemGroup);
router.delete("/:id", auth, deleteItemGroup);

module.exports = router;
