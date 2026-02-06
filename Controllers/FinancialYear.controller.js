const FinancialYear = require("../Models/FinancialYear");
const moment = require("moment");
const Registereduser = require("../Models/User");
const closeFinancialYear = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId = req.userId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) return res.status(404).json({ message: "Invalid Hotel" });

    const fy = await FinancialYear.findOne({
      hotelId: hotel._id,
      status: "OPEN"
    });

    if (!fy) {
      return res.status(400).json({ message: "No open financial year found" });
    }

    const today = moment().format("YYYY-MM-DD");

    // 🔐 Allow close only after 31 March
    if (today <= fy.endDate) {
      return res.status(403).json({
        message: "Financial year cannot be closed before 31 March"
      });
    }

    fy.status = "CLOSED";
    fy.closedOn = today;
    fy.closedBy = userId;
    await fy.save();

    // 🆕 Create next FY
    const nextFY = {
      hotelId: hotel._id,
      startDate: moment(fy.endDate).add(1, "day").format("YYYY-MM-DD"),
      endDate: moment(fy.endDate).add(1, "year").format("YYYY-MM-DD"),
      status: "OPEN"
    };

    await FinancialYear.create(nextFY);

    res.json({
      message: "Financial Year closed successfully",
      closedFY: fy,
      newFY: nextFY
    });

  } catch (err) {
    res.status(500).json({ message: "FY close failed", error: err });
  }
};
module.exports = {
  closeFinancialYear
};