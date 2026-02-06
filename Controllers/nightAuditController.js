const Checkin = require("../Models/checkin");
const Registereduser = require("../Models/User");
const BusinessDate = require("../Models/BusinessDate");
const FinancialYear = require("../Models/FinancialYear");

// ================= TAX CALC =================
// ================= TAX CALC =================
function calculateTax(amount, taxRows = [], taxInc = "No") {

  let totalTax = 0;
  const taxBreakup = [];

  // 👉 Total tax %
  const totalTaxPercent = taxRows.reduce(
    (sum, tax) => sum + (Number(tax.rate) || 0),
    0
  );

  // 👉 Base amount calculation
  let baseAmount = amount;

  if (taxInc === "Yes" && totalTaxPercent > 0) {
    baseAmount = (amount * 100) / (100 + totalTaxPercent);
  }

  // 👉 Individual tax calculation
  for (const tax of taxRows) {
    if (!tax.taxMaster) continue;

    const taxAmount =
      (baseAmount * Number(tax.rate)) / 100;

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
}


// ================= CHARGE POSTING =================
const chargePosting = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;
    const { postDate } = req.body;

    if (!postDate) {
      return res.status(400).json({ message: "Posting date is required" });
    }

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }
// ================= BUSINESS DATE VALIDATION =================
const businessDate = await BusinessDate.findOne({ hotelId: hotel._id });

if (!businessDate) {
  return res.status(400).json({
    message: "Business date not configured"
  });
}

// ❌ Backdate / future date block
if (postDate !== businessDate.currentDate) {
  return res.status(403).json({
    message: "Backdate / future date posting not allowed"
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

// ❌ Closed FY me posting allowed nahi
if (postDate < fy.startDate || postDate > fy.endDate) {
  return res.status(403).json({
    message: "Posting not allowed in closed financial year"
  });
}

 const checkins = await Checkin.find({
  hotelId: hotel._id,
  checkInDate: { $lte: postDate },
  checkOutDate: { $gt: postDate }   // 👈 yahan >= ki jagah >
})

      .populate({
        path: "rooms.room",
        populate: {
          path: "chargeMaster",
          populate: [
            // Revenue Ledger
            {
              path: "accountName",
              populate: { path: "userGroup" }
            },

            // Tax Structure → Tax Master → Sundry + Ledgers
            {
              path: "taxStructure",
              populate: {
                path: "rows.taxMaster",
                populate: [
                  { path: "sundryName" }, // SundryMaster
                  { path: "accountName", populate: { path: "userGroup" } },
                  { path: "payableAccount", populate: { path: "userGroup" } },
                  { path: "unregisteredAccount", populate: { path: "userGroup" } }
                ]
              }
            }
          ]
        }
      });

    if (!checkins.length) {
      return res.json({ message: "No active check-ins" });
    }

    for (const checkin of checkins) {

      // ================= ROOM RENT =================
      for (const roomLine of checkin.rooms) {
        if (!roomLine?.room?.chargeMaster) continue;

        const chargeMaster = roomLine.room.chargeMaster;
        const taxRows = chargeMaster.taxStructure?.rows || [];
        const baseRate = Number(roomLine.rateRs || 0);

        // Skip if already posted
        const alreadyPosted = checkin.postedCharges.some(
          c => c.postDate === postDate && c.chargeHead === "Room Rent"
        );
        if (alreadyPosted) continue;

       const {
  baseAmount,
  totalTax,
  taxBreakup
} = calculateTax(baseRate, taxRows, roomLine.taxInc);



const roomRentAmount = baseAmount;


        // ---- ROOM RENT ----
        if (chargeMaster.accountName) {
          checkin.postedCharges.push({
            postDate,
            chargeHead: "Room Rent",
            ledger: chargeMaster.accountName._id,
            groupAccount: chargeMaster.accountName.userGroup,
            source: "ROOM_RENT",
            drCr: "DR",
            amount: roomRentAmount,
            remarks: "Room Rent Posting"
          });
        }

        // ---- TAX ----
        for (const tax of taxBreakup) {
          const sundry = tax.sundry;
          const taxMaster = tax.taxMaster;

          if (!sundry || !taxMaster) continue;

          // Decide ledger based on guest type
          const ledgerToUse = checkin.isRegisteredGuest
            ? taxMaster.accountName
            : taxMaster.unregisteredAccount;

          if (!ledgerToUse) continue;

          checkin.postedCharges.push({
            postDate,
            chargeHead: sundry.sundryName, // CGST / SGST / IGST
            ledger: ledgerToUse._id,
            groupAccount: ledgerToUse.userGroup,
            source: "TAX",
            drCr: sundry.calcSign === "+" ? "DR" : "CR",
            amount: tax.amount,
           remarks: `${tax.taxName} Posting` 
          });
        }
      }

      // ================= INCLUSIONS =================
      for (const inc of checkin.roomInclusions || []) {
        if (inc.chargePost === "ONCE" && inc.posted) continue;

        const alreadyPosted = checkin.postedCharges.some(
          c => c.postDate === postDate && c.chargeHead === inc.chargeName
        );
        if (alreadyPosted) continue;

        checkin.postedCharges.push({
          postDate,
          chargeHead: inc.chargeName,
          chargeMaster: inc.chargeMaster,
          source: "INCLUSION",
          drCr: "DR",
          amount: inc.amount,
          postedBy: userId,
          remarks: "Auto inclusion posting"
        });

        if (inc.chargePost === "ONCE") inc.posted = true;
      }

      await checkin.save();
    }

    res.json({ message: "Charges posted successfully", date: postDate });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Charge posting failed",
      error: error.message
    });
  }
};

module.exports = { chargePosting };
