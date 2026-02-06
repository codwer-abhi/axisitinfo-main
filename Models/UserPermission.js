const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    userMasterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserMaster",
      required: true
    },

    firmName: String,

    section: {
      type: String,
      required: true
    },

    screenName: {
      type: String,
      required: true
    },

    permissions: {
      view: { type: Boolean, default: false },
      insert: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      print: { type: Boolean, default: false }
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPermission", permissionSchema);
