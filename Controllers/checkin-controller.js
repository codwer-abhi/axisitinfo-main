const Checkin = require("../Models/checkin");
const Registereduser = require("../Models/User");
const BusinessDate = require("../Models/BusinessDate");
const FinancialYear = require("../Models/FinancialYear");
const createCheckin = async (req, res) => {
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

    // 🔒 Backdate check-in block
    if (req.body.checkInDate < businessDate.currentDate) {
      return res.status(403).json({
        message: "Backdate check-in not allowed after audit"
      });
    }
// ================= FINANCIAL YEAR VALIDATION =================
const fy = await FinancialYear.findOne({
  hotelId: hotel._id,
  status: "OPEN"
});

if (!fy) {
  return res.status(403).json({
    message: "No open financial year found"
  });
}

// ❌ Closed FY me check-in not allowed
if (req.body.checkInDate < fy.startDate || req.body.checkInDate > fy.endDate) {
  return res.status(403).json({
    message: "Check-in not allowed in closed financial year"
  });
}

    // Folio logic remains same 👇
    const lastCheckin = await Checkin.findOne({ hotelId: hotel._id })
      .sort({ folioNo: -1 })
      .select("folioNo");

    let nextFolioNo = lastCheckin ? lastCheckin.folioNo + 1 : 1;

    const createdCheckins = [];

    for (const room of req.body.rooms) {
      const checkin = new Checkin({
        hotelId: hotel._id,
        userId,
        folioNo: nextFolioNo,
        ...req.body,
        rooms: [room],
        roomInclusions: req.body.roomInclusions || []
      });

      await checkin.save();
      createdCheckins.push(checkin);
      nextFolioNo++;
    }

    res.status(201).json({
      message: "Check-in created successfully",
      data: createdCheckins
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};



// GET CHECKINS
const getCheckinsForUser = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const checkins = await Checkin.find({
      hotelId: hotel._id
    }).sort({ folioNo: -1 });

    res.status(200).json({
      message: "Hotel Check-in Records",
      data: checkins
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch check-in data",
      error
    });
  }
};

const addAdvanceCharge = async (req, res) => {
  try {
    const { folioNo } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const checkin = await Checkin.findOne({
      folioNo,
      hotelId: hotel._id
    });

    if (!checkin) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    const {
      vrDate,
      time,
      chargePayment,
      amount,
      narration,
      printReceipt
    } = req.body;

    checkin.advanceCharges.push({
      vrDate,
      time,
      chargePayment,
      amount,
      narration,
      printReceipt
    });

    await checkin.save();

    res.status(200).json({
      message: "Advance charge added successfully",
      data: checkin.advanceCharges
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add advance charge",
      error
    });
  }
};

const getAdvanceChargesByFolio = async (req, res) => {
  try {
    const { folioNo } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const checkin = await Checkin.findOne({
      folioNo,
      hotelId: hotel._id
    }).populate("advanceCharges.chargePayment");

    if (!checkin) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    res.status(200).json({
      message: "Advance charges fetched successfully",
      data: checkin.advanceCharges || []
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch advance charges",
      error
    });
  }
};
const addRoomInclusions = async (req, res) => {
  try {
    const { folioNo } = req.params;
    const { inclusions } = req.body;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel" });

    const checkin = await Checkin.findOne({
      folioNo,
      hotelId: hotel._id
    });

    if (!checkin) {
      return res.status(404).json({ message: "Checkin not found" });
    }

    for (const inc of inclusions) {
      checkin.roomInclusions.push({
        chargeMaster: inc.chargeMasterId,
        chargeName: inc.chargeName,
        amount: inc.amount,
        chargePost: inc.chargePost,
        remarks: inc.remarks || ""
      });
    }

    await checkin.save();

    res.status(200).json({
      message: "Room inclusions saved",
      data: checkin.roomInclusions
    });

  } catch (error) {
    res.status(500).json({ message: "Failed", error });
  }
};
const markBillGenerated = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const checkin = await Checkin.findOne({
      _id: id,
      hotelId: hotel._id
    });

    if (!checkin) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    // 🔥 FLAG UPDATE
    checkin.billGenerated = true;
    await checkin.save();

    res.status(200).json({
      message: "Bill marked as generated",
      billGenerated: true
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to mark bill generated",
      error
    });
  }
};
const generateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelCode = req.hotelId;


    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid hotel" });

    const checkin = await Checkin.findOne({
      _id: id,
      hotelId: hotel._id
    });


    if (!checkin) {
      return res.status(404).json({ message: "Checkin not found" });
    }

    // 🔒 Already generated → reuse
    if (checkin.billGenerated && checkin.billNo) {
      return res.json({
        billNo: checkin.billNo,
        reused: true
      });
    }

    // 🔥 Financial Year
    const fy = await FinancialYear.findOne({
      hotelId: hotel._id,
      status: "OPEN"
    });
console.log(fy);

    if (!fy) {
      return res.status(403).json({ message: "No open financial year" });
    }

    // 🔢 Find last bill number of FY
    const lastBill = await Checkin.findOne({
      hotelId: hotel._id,
      billNo: { $ne: null }
    })
      .sort({ billGeneratedAt: -1 })
      .select("billNo");

    let nextSeq = 1;

    if (lastBill?.billNo) {
      const parts = lastBill.billNo.split("/");
      nextSeq = parseInt(parts[2]) + 1;
    }

   const startYear = new Date(fy.startDate).getFullYear();
const endYear = new Date(fy.endDate).getFullYear();

const fyLabel = `${startYear}-${endYear}`;

    
    const billNo = `INV/${fyLabel}/${String(nextSeq).padStart(6, "0")}`;

    // 💾 Save
    checkin.billNo = billNo;
    checkin.billGenerated = true;
    checkin.billGeneratedAt = new Date();
    checkin.billCancelled = false;

    await checkin.save();

    res.json({
      billNo,
      generated: true
    });

  } catch (err) {
    res.status(500).json({ message: "Bill generate failed", err });
  }
};
const cancelBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const hotelCode = req.hotelId;
    const userId = req.userId;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Bill cancel reason is required"
      });
    }

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const checkin = await Checkin.findOne({
      _id: id,
      hotelId: hotel._id
    });

    if (!checkin) {
      return res.status(404).json({ message: "Check-in not found" });
    }

    // ❌ Bill not generated
    if (!checkin.billGenerated) {
      return res.status(400).json({
        message: "Bill not generated yet"
      });
    }

    // ❌ Already cancelled
    if (checkin.billCancelled) {
      return res.status(400).json({
        message: "Bill already cancelled"
      });
    }

    // 🔥 FINAL CORRECT LOGIC
    checkin.billCancelled = true;
    checkin.billCancelledAt = new Date();
    checkin.billCancelledBy = userId;
    checkin.billCancelReason = reason;

    // 🔥 IMPORTANT RESET
    checkin.billNo = null;               // ❌ bill number removed
    checkin.billGenerated = false;       // ❌ bill marked as NOT generated
    checkin.billGeneratedAt = null;      // (optional but clean)

    await checkin.save();

    res.status(200).json({
      message: "Bill cancelled successfully",
      billCancelled: true
    });

  } catch (error) {
    res.status(500).json({
      message: "Bill cancel failed",
      error
    });
  }
};
const settleBill = async (req, res) => {
  try {
    const { id: checkinId } = req.params; // ✅ FIX
    const { payments } = req.body;

    console.log("Checkin ID:", checkinId);


    const hotelCode = req.hotelId;
    const userId = req.userId;

    // 🔐 HOTEL VALIDATION
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔐 CHECKIN VALIDATION (hotel scoped)
    const checkin = await Checkin.findOne({
      _id: checkinId,
      hotelId: hotel._id
    });

    if (!checkin) {
      return res.status(404).json({ message: "Checkin not found" });
    }

    // ❌ Bill not generated
    if (!checkin.billGenerated) {
      return res.status(400).json({ message: "Bill not generated" });
    }

    // ❌ Already settled
    if (checkin.billSettled) {
      return res.status(400).json({ message: "Bill already settled" });
    }

    /* ================= BILL CALCULATION ================= */

    const total = checkin.postedCharges.reduce(
      (s, c) => s + Number(c.amount || 0),
      0
    );

    const alreadyPaid = checkin.advanceCharges.reduce(
      (s, a) => s + Number(a.amount || 0),
      0
    );

    const settlingAmount = payments.reduce(
      (s, p) => s + Number(p.amount || 0),
      0
    );

    // ✅ ROUND SAFE BALANCE
    const balance = Number(
      (total - alreadyPaid - settlingAmount).toFixed(2)
    );

    // ❌ Not fully settled
    if (Math.abs(balance) > 0.01) {
      return res.status(400).json({
        message: "Bill must be settled fully",
        balance
      });
    }

    /* ================= SAVE SETTLEMENT ================= */

    const settlementEntries = payments.map(p => ({
      ...p,
      settledBy: userId,
      settledAt: new Date()
    }));

    checkin.settlements.push(...settlementEntries);
    checkin.billSettled = true;
    checkin.isCheckedOut = true;
    checkin.checkedOutAt = new Date();
    checkin.checkedOutBy = userId;

    await checkin.save();

    res.status(200).json({
      message: "Bill settled & guest checked out successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Settlement failed",
      error
    });
  }
};




module.exports = {
  createCheckin,
  getCheckinsForUser,
  addAdvanceCharge,
  getAdvanceChargesByFolio,
  addRoomInclusions,
  markBillGenerated,
  generateBill,
  cancelBill,
  settleBill
};
