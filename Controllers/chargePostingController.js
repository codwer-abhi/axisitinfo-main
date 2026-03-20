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

// 🔥 FINAL RESPONSE
res.json({
  message: "Charge posted & bill generated successfully",
  folioNo: checkin.folioNo
});

  } catch (error) {

    res.status(500).json({
      message: "Charge posting failed",
      error: error.message
    });

  }

};