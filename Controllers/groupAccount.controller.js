const GroupAccount = require("../Models/groupAccount.model");
const Registereduser = require("../Models/User");

// ✅ CREATE GROUP ACCOUNT
const createGroupAccount = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const userId=req.userId;
    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    // 🔒 unique group per hotel
    const exists = await GroupAccount.findOne({
      hotelId: hotel._id,
      groupName: req.body.groupName,
    });

    if (exists) {
      return res.status(400).json({ message: "Group already exists" });
    }

    const group = new GroupAccount({
      hotelId: hotel._id,        // 🔥 HOTEL LEVEL
      userId: userId,     // 🟡 audit
      ...req.body,
    });

    await group.save();

    res.status(201).json({
      message: "Group Account Created Successfully",
      data: group,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create group account",
      error,
    });
  }
};


const getGroupAccounts = async (req, res) => {
  try {
    const hotelCode = req.hotelId;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const groups = await GroupAccount.find({
      hotelId: hotel._id           // 🔥 ONLY hotel filter
    }).sort({ groupName: 1 });

    res.status(200).json({
      message: "Group Accounts List",
      data: groups,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch group accounts",
      error,
    });
  }
};



// ✅ UPDATE GROUP ACCOUNT
const updateGroupAccount = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const updated = await GroupAccount.findOneAndUpdate(
      {
        _id: id,
        hotelId: hotel._id        // 🔥 hotel wise update
      },
      {
        ...req.body,
        updatedBy: req.userId    // 🟡 audit
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({
      message: "Group Account Updated",
      data: updated,
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error,
    });
  }
};



const deleteGroupAccount = async (req, res) => {
  try {
    const hotelCode = req.hotelId;
    const { id } = req.params;

    const hotel = await Registereduser.findOne({ hotelCode });
    if (!hotel) {
      return res.status(404).json({ message: "Invalid Hotel Code" });
    }

    const deleted = await GroupAccount.findOneAndDelete({
      _id: id,
      hotelId: hotel._id        // 🔥 hotel wise delete
    });

    if (!deleted) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({
      message: "Group Account Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error,
    });
  }
};



module.exports = {
  createGroupAccount,
  getGroupAccounts,
  updateGroupAccount,
  deleteGroupAccount,
};
