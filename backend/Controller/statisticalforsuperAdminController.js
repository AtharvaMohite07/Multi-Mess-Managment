import UserPlan from "../Models/UserPlan.js";
import asyncHandler from 'express-async-handler';
import moment from "moment";
import DailyEntry from "../Models/DailyEntry.js";
import Inventory from "../Models/Inventory.js";
import Mess from "../Models/Mess.js"; // Import the Mess model
import User from "../Models/User.js"; // Import the User model

export const getUserCountPerMess = asyncHandler(async (req, res) => {
    const today_date = moment().utcOffset("+05:30").startOf('month').startOf('week').toDate();
    const end_date1 = moment().utcOffset("+05:30").endOf('month').endOf('week').toDate();

    const userCounts = await UserPlan.aggregate([
        {
            $match: {
                "start_date": { $gte: today_date, $lte: end_date1 },
            },
        },
        {
            $group: {
                _id: "$messId", // Group by messId
                count: { $sum: 1 }, // Count users in each mess
            },
        },
    ]);

    res.json(userCounts);
});

export const getOverallUserDistribution = asyncHandler(async (req, res) => {
    const distribution = await User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);

    res.json(distribution);
});

// New function to get total mess count

export const getTotalMessCount = asyncHandler(async (req, res) => {
    const count = await Mess.countDocuments();
    res.json({ count });
});