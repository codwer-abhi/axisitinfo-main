const express = require("express");
const router = express.Router();
const upload = require("../MIddlewares/uploadImages");
const {
  createOutlet,
  getOutlets,
  updateOutlet,
  deleteOutlet
} = require("../Controllers/outletController");
const authMiddleware = require("../MIddlewares/authMiddleware");
router.post(
  "/create",
  authMiddleware,
  upload.single("companyLogo"),   // ⭐ SAME AS RoomCategory
  createOutlet
);
router.get("/", authMiddleware, getOutlets);
router.put(
  "/update/:id",
  authMiddleware,
  upload.single("companyLogo"),
  updateOutlet
);
router.delete("/:id", authMiddleware, deleteOutlet);

module.exports = router;
