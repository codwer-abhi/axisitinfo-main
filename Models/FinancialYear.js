const mongoose = require("mongoose");

const financialYearSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },
  startDate: String,   // "2024-04-01"
  endDate: String,     // "2025-03-31"
  status: {
    type: String,
    enum: ["OPEN", "CLOSED"],
    default: "OPEN"
  },
  closedOn: String,
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("FinancialYear", financialYearSchema);
