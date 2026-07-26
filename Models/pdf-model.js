const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "PDF title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // URL ke liye unique slug
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Original uploaded file name
    fileName: {
      type: String,
      required: true,
    },

    // Server me file ka path
    filePath: {
      type: String,
      required: true,
    },

    // File Size (Bytes)
    fileSize: {
      type: Number,
      default: 0,
    },

    // MIME Type
    mimeType: {
      type: String,
      default: "application/pdf",
    },

    // Kis admin ne upload ki
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "axisitinfo", // auth-model ka model name
    },

    // Download Count
    downloads: {
      type: Number,
      default: 0,
    },

    // Soft Delete / Active
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pdf", pdfSchema);