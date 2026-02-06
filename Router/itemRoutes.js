const express = require("express");
const router = express.Router();
const upload = require("../MIddlewares/uploadImages"); // multer
const auth = require("../MIddlewares/authMiddleware");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem
} = require("../Controllers/itemController");

router.post("/create", auth, upload.single("itemImage"), createItem);
router.get("/", auth, getItems);
router.put("/update/:id", auth, upload.single("itemImage"), updateItem);
router.delete("/:id", auth, deleteItem);

module.exports = router;
