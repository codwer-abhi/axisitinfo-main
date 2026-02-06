const KotPrinting = require("../Models/KotPrinting");
const Registereduser = require("../Models/User");

const createKotPrinting = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔥 Bulk insert (faster & cleaner)
    const records = req.body.rows.map(row => ({
      hotelId: hotel._id,           // 🔥 HOTEL LEVEL
      module: row.module,
      departmentName: row.departmentName,
      description: row.description,
      printingPath: row.printingPath,
      kitchen: row.kitchen,
      createdBy: req.userId         // 🟡 optional (audit)
    }));

    const saved = await KotPrinting.insertMany(records);

    res.status(201).json({
      message: "KOT Printing configuration saved",
      data: saved
    });

  } catch (error) {
    res.status(500).json({
      message: "Creation failed",
      error
    });
  }
};

/* ================= GET (HOTEL WISE) ================= */
const getKotPrintingList = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await KotPrinting.find({
      hotelId: hotel._id           // 🔥 ONLY hotel filter
    }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "KOT Printing list fetched",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Fetch failed",
      error
    });
  }
};

/* ================= UPDATE ================= */
const updateKotPrinting = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await KotPrinting.findOneAndUpdate(
      {
        _id: id,
        hotelId: hotel._id        // 🔥 hotel wise update
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({
      message: "Updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error
    });
  }
};


/* ================= DELETE ================= */
const deleteKotPrinting = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await KotPrinting.findOneAndDelete({
      _id: id,
      hotelId: hotel._id          // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error
    });
  }
};

module.exports = {
  createKotPrinting,
  getKotPrintingList,
  updateKotPrinting,
  deleteKotPrinting
};
