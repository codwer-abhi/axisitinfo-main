const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  rooms: { type: Number },
  country: { type: String },
  state: { type: String },
  phoneCode: { type: String },
  phone: { type: String },
  hotelCode: {
    type: String,
    default: null
},
  status: { type: String, enum: ['pending-email-verification','pending-admin-approval','approved','rejected'], default: 'pending-email-verification' },
  otp: {
    code: String,
    expiresAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});

const Registereduser = mongoose.model('User', UserSchema);

module.exports = Registereduser;