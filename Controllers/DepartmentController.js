const Department = require("../Models/Department");
const Registereduser = require("../Models/User");


/* ================= CREATE ================= */
const createDepartment = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const { departmentName, shortName, departmentNature } = req.body;

    if (!departmentName || !shortName || !departmentNature) {
      return res.status(400).json({
        message: "Department Name, Short Name & Nature required"
      });
    }

    // 🔐 Hotel validation
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🚫 Duplicate check (hotel-wise)
    const exists = await Department.findOne({
      hotelId: hotel._id,
      departmentName
    });

    if (exists) {
      return res.status(409).json({
        message: "Department already exists"
      });
    }

    const department = await Department.create({
      hotelId: hotel._id,
      hotelCode,
      createdBy: userId,
      createdByModel: req.loginType === "OWNER" ? "User" : "UserMaster",
      departmentName,
      shortName,
      departmentNature
    });

    res.status(201).json({
      message: "Department created successfully",
      data: department
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create department",
      error
    });
  }
};


/* ================= LIST ================= */
const getDepartments = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const list = await Department.find({
      hotelId: hotel._id
    })
      .populate("createdBy", "username")
      .sort({ departmentName: 1 });

    res.status(200).json({
      message: "Department list",
      data: list
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch department list",
      error
    });
  }
};


/* ================= UPDATE ================= */
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await Department.findOneAndUpdate(
      { _id: id, hotelId: hotel._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update department",
      error
    });
  }
};


/* ================= DELETE ================= */
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await Department.findOneAndDelete({
      _id: id,
      hotelId: hotel._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete department",
      error
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment
};
