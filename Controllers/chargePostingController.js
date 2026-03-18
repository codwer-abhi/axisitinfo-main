const Checkin = require("../Models/checkin");
const Registereduser = require("../Models/User");
const BusinessDate = require("../Models/BusinessDate");
const FinancialYear = require("../Models/FinancialYear");

const calculateTax = (amount, taxRows = [], taxInc = "No") => {

  let totalTax = 0;
  const taxBreakup = [];

  const totalTaxPercent = taxRows.reduce(
    (sum, tax) => sum + (Number(tax.rate) || 0),
    0
  );

  let baseAmount = amount;

  if (taxInc === "Yes" && totalTaxPercent > 0) {
    baseAmount = (amount * 100) / (100 + totalTaxPercent);
  }

  for (const tax of taxRows) {

    const taxAmount = (baseAmount * Number(tax.rate)) / 100;

    totalTax += taxAmount;

    taxBreakup.push({
      taxName: tax.taxMaster.taxName,
      taxMaster: tax.taxMaster,
      sundry: tax.taxMaster.sundryName,
      amount: Number(taxAmount.toFixed(2))
    });
  }

  return {
    baseAmount: Number(baseAmount.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
    taxBreakup
  };
};

exports.postChargeByFolio = async (req, res) => {

  try {

    const hotelCode = req.hotelId;
    const userId = req.userId;
    const { folioNo } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });

    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const businessDate = await BusinessDate.findOne({ hotelId: hotel._id });

    if (!businessDate) {
      return res.status(400).json({ message: "Business date not configured" });
    }

    const postDate = businessDate.currentDate;

    const checkin = await Checkin.findOne({
      hotelId: hotel._id,
      folioNo: folioNo
    })
      .populate({
        path: "rooms.room",
        populate: {
          path: "chargeMaster",
          populate: {
            path: "taxStructure",
            populate: {
              path: "rows.taxMaster",
              populate: "sundryName"
            }
          }
        }
      });

    if (!checkin) {
      return res.status(404).json({ message: "Folio not found" });
    }

    for (const roomLine of checkin.rooms) {

      const chargeMaster = roomLine.room.chargeMaster;

      const taxRows = chargeMaster.taxStructure?.rows || [];

      const baseRate = Number(roomLine.rateRs || 0);

      const alreadyPosted = checkin.postedCharges.some(
        c => c.postDate === postDate && c.chargeHead === "Room Rent"
      );

      if (alreadyPosted) {
        return res.json({ message: "Charge already posted" });
      }

      const { baseAmount, taxBreakup } = calculateTax(
        baseRate,
        taxRows,
        roomLine.taxInc
      );

      // ROOM RENT
      checkin.postedCharges.push({
        postDate,
        chargeHead: "Room Rent",
        source: "ROOM_RENT",
        drCr: "DR",
        amount: baseAmount,
        postedBy: userId,
        remarks: "Room Rent Posting"
      });

      // TAX
      for (const tax of taxBreakup) {

        checkin.postedCharges.push({
          postDate,
          chargeHead: tax.sundry.sundryName,
          source: "TAX",
          drCr: "DR",
          amount: tax.amount,
          postedBy: userId,
          remarks: tax.taxName
        });
      }
    }

    await checkin.save();
// ================= AUTO BILL GENERATE =================
try {

  if (!checkin.billGenerated) {

    const fy = await FinancialYear.findOne({
      hotelId: hotel._id,
      status: "OPEN"
    });

    if (fy) {

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

      checkin.billNo = billNo;
      checkin.billGenerated = true;
      checkin.billGeneratedAt = new Date();
      checkin.billCancelled = false;

      await checkin.save(); // 🔥 second save
    }
  }

} catch (err) {
  console.error("Auto bill generate error:", err.message);
}
    res.json({
      message: "Charge posted successfully",
      folioNo: checkin.folioNo,
      billNo: checkin.billNo
    });

  } catch (error) {

    res.status(500).json({
      message: "Charge posting failed",
      error: error.message
    });

  }

};