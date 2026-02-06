const TaxStructure = require("../Models/TaxStructure.js");
const RegisteredUser = require("../Models/User.js");
const TaxMaster = require("../Models/TaxMaster");

// ✅ CREATE TAX STRUCTURE
const createTaxStructure = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await RegisteredUser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔴 STEP 1: VALIDATE TAX MASTER IDS
    if (!Array.isArray(req.body.rows) || req.body.rows.length === 0) {
      return res.status(400).json({ message: "Rows are required" });
    }

    for (const row of req.body.rows) {
      const exists = await TaxMaster.findById(row.taxMaster);
      if (!exists) {
        return res.status(400).json({
          message: "Invalid TaxMaster in rows"
        });
      }
    }

    // 🔴 STEP 2: CREATE
    const taxStructure = new TaxStructure({
      propertyId: hotelCode,
      taxStructureName: req.body.taxStructureName,
      rows: req.body.rows,
      createdBy: userId
    });

    await taxStructure.save();

    res.status(201).json({
      message: "Tax Structure created successfully",
      data: taxStructure
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create tax structure",
      error: error.message
    });
  }
};


// ✅ GET TAX STRUCTURES (PROPERTY WISE)
const getTaxStructures = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const data = await TaxStructure.find({
      propertyId: hotelCode
    })
    .populate({
      path: "rows.taxMaster",
      select: "taxName accountName sundryName payableAccount"
    })
    .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tax Structures fetched",
      data
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tax structures",
      error: error.message
    });
  }
};


// ✅ DELETE
const deleteTaxStructure = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const deleted = await TaxStructure.findOneAndDelete({
      _id: id,
      propertyId: hotelCode   // ⭐ security
    });

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Tax Structure deleted" });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error
    });
  }
};
// ✅ UPDATE TAX STRUCTURE
// ✅ UPDATE TAX STRUCTURE
const updateTaxStructure = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;
    const { taxStructureName, rows } = req.body;

    if (!taxStructureName && !rows) {
      return res.status(400).json({
        message: "Nothing to update"
      });
    }

    // 🔴 VALIDATE ROWS ONLY IF PROVIDED
    if (rows) {
      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ message: "Rows cannot be empty" });
      }

      for (const row of rows) {
        const exists = await TaxMaster.findById(row.taxMaster);
        if (!exists) {
          return res.status(400).json({
            message: "Invalid TaxMaster in rows"
          });
        }
      }
    }

    const updated = await TaxStructure.findOneAndUpdate(
      {
        _id: id,
        propertyId: hotelCode
      },
      {
        ...(taxStructureName && { taxStructureName }),
        ...(rows && { rows })
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Tax Structure not found"
      });
    }

    res.status(200).json({
      message: "Tax Structure updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update tax structure",
      error: error.message
    });
  }
};


module.exports = {
  createTaxStructure,
  getTaxStructures,
  deleteTaxStructure,
    updateTaxStructure
};
    