const mongoose = require("mongoose");

const advanceChargeSchema = new mongoose.Schema({
  vrDate: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },

  chargePayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMaster", // Cash / Card / UPI etc
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  narration: {
    type: String
  },

  printReceipt: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });
const roomInclusionSchema = new mongoose.Schema({
  chargeMaster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChargeMaster",
    required: true
  },

  chargeName: String,
  amount: Number,

  // 🔥 DAILY / ONCE
  chargePost: {
    type: String,
    enum: ["DAILY", "ONCE"],
    required: true
  },

  posted: {                // ONCE ke liye use hoga
    type: Boolean,
    default: false
  },

  remarks: String
}, { timestamps: true });



const chargePostingSchema = new mongoose.Schema({
  postDate: { type: String, required: true },

  chargeHead: { type: String, required: true },

  chargeMaster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChargeMaster"
  },
 
  taxMaster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaxMaster"
  },

  source: {
    type: String,
    enum: ["ROOM_RENT", "INCLUSION", "TAX", "MANUAL"],
    default: "INCLUSION"
  },

  drCr: {
    type: String,
    enum: ["DR", "CR"]
  },

  amount: { type: Number, required: true },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser"
  },

  remarks: String
}, { timestamps: true });



const checkinSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registereduser",
    required: true
  },

  // ⭐ AUTO GENERATED FOLIO NUMBER
  folioNo: {
    type: Number,
    required: true
  },
 billGenerated: { type: Boolean, default: false },
billNo: { type: String, default: null },
billGeneratedAt: Date,
billCancelled: { type: Boolean, default: false },

billCancelledAt: {
  type: Date
},

billCancelledBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Registereduser"
},

billCancelReason: {
  type: String
},
isCheckedOut: {
  type: Boolean,
  default: false
},

checkedOutAt: Date,

billSettled: {
  type: Boolean,
  default: false
},

settlements: [
  {
    date: String,
    time: String,
    mode: String,      // CASH / CARD / UPI
    amount: Number,
    narration: String
  }
],

  checkInDate: String,
  checkInTime: String,
  nights: Number,
  checkOutDate: String,
  checkOutTime: String,
  remarks: String,
  pickupDrop: String,
  company: String,

  bookingSource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookingSource",
    required: true
  },

  businessSource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSource",
    required: true
  },

  billTo: String,

  rooms: [
  {
    roomType: String,
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomMaster"   // 🔥 IMPORTANT
    },
    adult: Number,
    child: Number,
    plans: String,
    rateRs: String,
    taxInc: String,
    leader: String
  }
],


  complimentaryRoom: { type: Boolean, default: false },

  guestTitle: String,
  guestFirstName: String,
  guestFullName: String,
  mobile: String,
  email: String,
  city: String,
  state: String,
  country: String,
  nationality: String,
  zipCode: String,
  address1: String,
  address2: String,

  sendEmailCheckout: { type: Boolean, default: false },
  suppressRate: { type: Boolean, default: false },
roomInclusions: [roomInclusionSchema],

  // 🔥 ADVANCE CHARGES
  advanceCharges: [advanceChargeSchema],
// 🔥 POSTED CHARGES (SYSTEM GENERATED)
postedCharges: [chargePostingSchema]

}, { timestamps: true });

module.exports = mongoose.model("Checkin", checkinSchema);
