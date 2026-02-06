const Checkin = require("../Models/checkin");
const Registereduser = require("../Models/User");
const BusinessDate = require("../Models/BusinessDate");
const NightAudit = require("../Models/NightAuditLog");
const moment = require("moment");

// ================= NIGHT AUDIT =================
const runNightAudit = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const businessDate = await BusinessDate.findOne({ hotelId: hotel._id });
    if (!businessDate) {
      return res.status(400).json({ message: "Business date not configured" });
    }
   const auditDate = businessDate.currentDate;



    // 🔐 Duplicate audit protection
    if (businessDate.lastAuditDate === auditDate) {
      return res.status(400).json({
        message: "Night Audit already completed for this date"
      });
    }

    // 🔍 Step 1: Pending Charge Validation
    const activeCheckins = await Checkin.find({
      hotelId: hotel._id,
      checkInDate: { $lte: auditDate },
      checkOutDate: { $gt: auditDate }
    });



const pendingCharges = activeCheckins.filter(c =>
  !c.postedCharges.some(
    pc =>
      pc.postDate === auditDate &&
      pc.chargeHead === "Room Rent"
  )
);


    if (pendingCharges.length > 0) {
      return res.status(400).json({
        message: "Night Audit blocked. Pending room charges exist.",
        pendingFolios: pendingCharges.map(c => c.folioNo)
      });
    }

    // 📊 Step 2: Summary
    let totalAmount = 0;

activeCheckins.forEach(c => {
  c.postedCharges.forEach(pc => {
    if (
      pc.postDate === auditDate &&
      pc.chargeHead === "Room Rent"
    ) {
      totalAmount += pc.amount;
    }
  });
});


    // 🧾 Step 3: Save Audit Log
    await NightAudit.create({
      hotelId: hotel._id,
      auditDate,
      auditBy: userId,
      totalCheckins: activeCheckins.length,
      totalRoomCharges: totalAmount
    });

    // 🔁 Step 4: Roll Business Date
    businessDate.lastAuditDate = auditDate;
    businessDate.currentDate = moment(auditDate)
      .add(1, "days")
      .format("YYYY-MM-DD");

    businessDate.status = "OPEN";
    await businessDate.save();

    res.status(200).json({
      message: "Night Audit completed successfully",
      closedDate: auditDate,
      newBusinessDate: businessDate.currentDate
    });

  } catch (error) {
    res.status(500).json({
      message: "Night Audit failed",
      error
    });
  }
};
// ================= GET CURRENT BUSINESS DATE =================
const getBusinessDate = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const businessDate = await BusinessDate.findOne({ hotelId: hotel._id });
    if (!businessDate) {
      return res.status(400).json({ message: "Business date not configured" });
    }

    res.status(200).json({
      businessDate: businessDate.currentDate,
      lastAuditDate: businessDate.lastAuditDate,
      status: businessDate.status
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch business date",
      error
    });
  }
};

module.exports = {
  runNightAudit,
  getBusinessDate
};
