const multer = require("multer");
const fs = require("fs");
const path = require("path");

// =======================================
// Upload Folder
// =======================================

const uploadPath = path.join(__dirname, "../uploads/pdf");

// Folder exist nahi karta to create karo
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// =======================================
// Storage
// =======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// =======================================
// File Filter
// =======================================

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed."), false);
  }

  cb(null, true);
};

// =======================================
// Multer Upload
// =======================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

module.exports = upload;