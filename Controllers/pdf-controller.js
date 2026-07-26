const Pdf = require("../Models/pdf-model");
const fs = require("fs");
const path = require("path");

// ===========================================
// Upload PDF
// POST /api/pdf/upload
// ===========================================
const uploadPdf = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "PDF title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    // Generate Unique Slug
    const totalPdf = await Pdf.countDocuments();
    const slug = `pdf${String(totalPdf + 1).padStart(4, "0")}`;

    const pdf = await Pdf.create({
      title,
      description,
      slug,
      fileName: req.file.filename,
      filePath: req.file.path.replace(/\\/g, "/"),
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "PDF Uploaded Successfully",
      data: pdf,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================================
// Get All PDFs
// GET /api/pdf
// ===========================================

const getAllPdf = async (req, res) => {
  try {

    const pdfs = await Pdf.find({ active: true })
      .populate("uploadedBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: pdfs.length,
      data: pdfs,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===========================================
// Get Single PDF
// GET /api/pdf/:slug
// ===========================================

const getSinglePdf = async (req, res) => {

  try {

    const pdf = await Pdf.findOne({
      slug: req.params.slug,
      active: true,
    }).populate("uploadedBy", "username email");

    if (!pdf) {

      return res.status(404).json({
        success: false,
        message: "PDF Not Found",
      });

    }

    pdf.downloads += 1;

    await pdf.save();

    return res.status(200).json({
      success: true,
      data: pdf,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===========================================
// Update PDF
// PUT /api/pdf/:id
// ===========================================

const updatePdf = async (req, res) => {

  try {

    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {

      return res.status(404).json({
        success: false,
        message: "PDF Not Found",
      });

    }

    pdf.title = req.body.title || pdf.title;
    pdf.description = req.body.description || pdf.description;

    if (req.file) {

      if (fs.existsSync(pdf.filePath)) {

        fs.unlinkSync(pdf.filePath);

      }

      pdf.fileName = req.file.filename;
      pdf.filePath = req.file.path.replace(/\\/g, "/");
      pdf.fileSize = req.file.size;
      pdf.mimeType = req.file.mimetype;

    }

    await pdf.save();

    return res.status(200).json({
      success: true,
      message: "PDF Updated Successfully",
      data: pdf,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===========================================
// Delete PDF
// DELETE /api/pdf/:id
// ===========================================

const deletePdf = async (req, res) => {

  try {

    const pdf = await Pdf.findById(req.params.id);

    if (!pdf) {

      return res.status(404).json({
        success: false,
        message: "PDF Not Found",
      });

    }

    if (fs.existsSync(pdf.filePath)) {

      fs.unlinkSync(pdf.filePath);

    }

    await Pdf.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "PDF Deleted Successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {

  uploadPdf,
  getAllPdf,
  getSinglePdf,
  updatePdf,
  deletePdf,

};