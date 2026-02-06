const PlanMaster = require("../Models/PlanMaster.js");
const Registereduser = require("../Models/User.js");

const createPlan = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔥 Auto increment planCode hotel-wise
    const lastPlan = await PlanMaster.findOne({
      hotelId: hotel._id
    })
      .sort({ planCode: -1 })
      .select("planCode");

    const newPlanCode =
      lastPlan && lastPlan.planCode ? lastPlan.planCode + 1 : 1001;

    const { planCode, ...safeBody } = req.body;

    const newPlan = new PlanMaster({
      hotelId: hotel._id,        // 🔥 HOTEL LEVEL
      userId: req.userId,     // 🟡 optional
      planCode: newPlanCode,
      ...safeBody,
    });

    await newPlan.save();

    res.status(201).json({
      message: "Plan created successfully",
      data: newPlan,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating plan",
      error: error.message,
    });
  }
};


const getPlans = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const plans = await PlanMaster.find({
      hotelId: hotel._id        // 🔥 ONLY hotel filter
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Plans fetched successfully",
      data: plans,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching plans", error });
  }
};


const updatePlan = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await PlanMaster.findOneAndUpdate(
      {
        _id: id,
        hotelId: hotel._id       // 🔥 hotel wise update
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({
      message: "Plan updated successfully",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating plan", error });
  }
};

const deletePlan = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await PlanMaster.findOneAndDelete({
      _id: id,
      hotelId: hotel._id        // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({
      message: "Plan deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting plan", error });
  }
};

module.exports = {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
};