const express = require("express");
const router = express.Router();

const authMiddleware = require("../MIddlewares/authMiddleware");
const adminAuthMiddleware=require('../MIddlewares/adminAuthMiddleware.js');

const upload = require("../MIddlewares/uploadPdf");

const {
  uploadPdf,
  getAllPdf,
  getSinglePdf,
  updatePdf,
  deletePdf,
} = require("../Controllers/pdf-controller");

// ===============================
// Upload PDF (Admin Login Required)
// POST /api/pdf/upload
// ===============================
router.post(
  "/uploads/pdf",
 adminAuthMiddleware,
  upload.single("file"),
  uploadPdf
);

// ===============================
// Get All PDFs
// GET /api/pdf
// ===============================
router.get("/uploads/pdf", getAllPdf);

// ===============================
// Get Single PDF By Slug
// GET /api/pdf/pdf0001
// ===============================
router.get("/:slug", getSinglePdf);

// ===============================
// Update PDF
// PUT /api/pdf/:id
// ===============================
router.put(
  "/:id",
  authMiddleware,
  upload.single("file"),
  updatePdf
);

// ===============================
// Delete PDF
// DELETE /api/pdf/:id
// ===============================
router.delete(
  "/:id",
  authMiddleware,
  deletePdf
);

module.exports = router;