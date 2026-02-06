const User = require('../Models/auth-model.js');
const Contact= require('../Models/Contact.js');
const RegisteredUser = require('../Models/User.js');
const moment = require("moment");
const FinancialYear = require("../Models/FinancialYear");

const sendApprovalEmail = require("../utils/approveEmail.js"); 
const generateUniqueHotelCode = async () => {
    let hotelCode;
    let exists = true;

    while (exists) {
        hotelCode = "AXIS-" + Math.floor(100000 + Math.random() * 900000);
        exists = await RegisteredUser.exists({ hotelCode });
    }

    return hotelCode;
};


const handleAdmin = async (req, res) => {
    try {
        const user = await User.find({}).select({ password: 0 }); 
        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.json({
            message: 'Admin Dashboard',
             user: user
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const handleContact = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: 'No contacts found' });
        }
        res.json({
            message: 'Contact List',
            contacts: contacts
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const handledelete = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedUser = await RegisteredUser.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Approved user not found" });
        }

        res.status(200).json({
            message: "Approved user deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const handlecontactdelete= async(req,res)=>{
    try{
        const id=req.params.id
        const deletedata=await Contact.deleteOne({_id:id});
    return res.status(200).json({
        message:'data deleted succesfully' 
    })

    }catch(error){
        res.status(500).json({ message: 'Internal Server Error' });   
    }
}

const getPendingUsers = async (req, res) => {
    try {
        const users = await RegisteredUser.find({ status: "pending-admin-approval" })
            .select({ passwordHash: 0 });

        res.json({ message: "Pending Users", users });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const createInitialFY = async (hotelId) => {
  const existingFY = await FinancialYear.findOne({
    hotelId,
    status: "OPEN"
  });

  if (existingFY) return;

  const today = moment();

  const fyStartYear =
    today.month() >= 3 ? today.year() : today.year() - 1;

  const startDate = moment(`${fyStartYear}-04-01`).format("YYYY-MM-DD");
  const endDate = moment(`${fyStartYear + 1}-03-31`).format("YYYY-MM-DD");

  await FinancialYear.create({
    hotelId,
    startDate,
    endDate,
    status: "OPEN"
  });
};

const approveUser = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await RegisteredUser.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.status === "approved") {
            return res.status(400).json({ message: "User already approved" });
        }

        // generate hotel code
        const hotelCode = await generateUniqueHotelCode();

        // approve user
        user.status = "approved";
        user.hotelCode = hotelCode;
        await user.save();

        // 🔑 CREATE INITIAL FINANCIAL YEAR (VERY IMPORTANT)
        await createInitialFY(user._id);

        // send approval email
        await sendApprovalEmail(user.email, user.name, hotelCode);

        return res.json({
            message: "User approved, FY created & email sent",
            hotelCode
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const rejectUser = async (req, res) => {
    try {
        const { userId } = req.body;

        await RegisteredUser.findByIdAndUpdate(userId, {
            status: "rejected"
        });

        res.json({ message: "User rejected" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const getApprovedUsers = async (req, res) => {
    try {
        const users = await RegisteredUser.find({ status: "approved" })
            .select("-passwordHash -otp");

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No approved users found" });
        }

        res.json({
            message: "Approved users fetched successfully",
            users
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// ---------------- UPDATE APPROVED USER ----------------
const updateApprovedUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const allowedFields = [
            "name",
            "email",
            "phone",
            "phoneCode",
            "hotelName",
            "rooms",
            "country",
            "state"
        ];

        const updates = {};

        // filtering only allowed fields
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const updatedUser = await RegisteredUser.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        ).select("-passwordHash -otp");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    handleAdmin,
    handleContact,
    handledelete,
    handlecontactdelete,
    getPendingUsers,
    approveUser,
    rejectUser,
    getApprovedUsers,
    updateApprovedUser
};