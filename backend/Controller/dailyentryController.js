import DailyEntry from "../Models/DailyEntry.js";
import bcrypt from 'bcrypt'
import UserPlan from "../Models/UserPlan.js";
import User from "../Models/User.js";
import asyncHandler from 'express-async-handler'
import moment from 'moment';

export const getUserEntryDetail = asyncHandler(async (req , res) => {
    const userId = req.params.userId
    const { id: messId } = req.params;

    if(!userId)
    {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const entry = await DailyEntry.findOne({"userId":userId,"messId":messId})
    // console.log(entry.attendance[0].date);
    const start_end = entry.attendance[0].date.getDate()
    // console.log(entry.attendance[entry.attendance.length-1].date);
    const end_date = entry.attendance[entry.attendance.length-1].date.getDate()
    // console.log(start_end , end_date);

    res.json(entry);

})
export const updateDailyEntry = asyncHandler(async (req, res) => {
    const { userId, verifyThing, planId , messId} = req.body;

    if (!verifyThing) {
        return { message: 'Select type required', status: 400 };
    }

    try {

        // Check if the user exists in the DailyEntry collection
        let user = await DailyEntry.findOne({ "userId": userId }).exec();

        // If the user is not found, create a new entry
        if (!user) {
            user = await DailyEntry.create({ userId, messId, attendance: [] });
        }
        const momentDate = moment().utcOffset('+05:30').startOf('day');
        const date = new Date();
        const isTodayAdded = user.attendance.find(item =>
            item.date.getDate() === date.getDate() &&
            item.date.getMonth() === date.getMonth() &&
            item.date.getFullYear() === date.getFullYear()
        );

        if (isTodayAdded) {
            if ((verifyThing === "breakfast" && isTodayAdded.menu.breakfast) ||
                (verifyThing === "lunch" && isTodayAdded.menu.lunch) ||
                (verifyThing === "dinner" && isTodayAdded.menu.dinner)) {
                return { message: `Your ${verifyThing} entry is already added`, status: 300 };

            }

            const updateEntry = await DailyEntry.updateOne(
                { "userId": userId },
                { $set: { [`attendance.$[elemX].menu.${verifyThing}`]: true } },
                { arrayFilters: [{ "elemX.date": isTodayAdded.date }] }
            );

            // Update user plan availability
            const updateIsAvailable = await UserPlan.updateOne(
                {
                    userId,
                    planId,
                    "isavailable.date": {
                        $gte: momentDate.toDate(),
                        $lt:  momentDate.add(1, 'day').toDate()
                    }
                },
                { $set: { [`isavailable.$.${verifyThing}`]: false } }
            );

            if (updateIsAvailable.nModified === 0) {
                return { message: `Failed to update isavailable field for ${verifyThing}`, status: 400 };
            }

            return { message: `Daily entry updated for ${verifyThing}`, status: 200 };
        } else {
            const dailyEntryObject = {
                "date": date,
                "currPlanId": planId,
                "menu": { [verifyThing]: true }
            };

            const updateEntry = await DailyEntry.updateOne(
                { "userId": userId },
                { $push: { "attendance": dailyEntryObject } }
            );

            // Update user plan availability
            const updateIsAvailable = await UserPlan.updateOne(
                {
                    userId,
                    planId,
                    "isavailable.date": {
                        $gte: momentDate.toDate(),
                        $lt: momentDate.add(1, 'day').toDate()
                    }
                },
                { $set: { [`isavailable.$.${verifyThing}`]: false } }
            );
            if (updateIsAvailable.nModified === 0) {
                return res.status(400).json({ message: `Failed to update isavailable field for ${verifyThing}` });
            }

            return res.status(200).json({ message: `Daily entry updated for ${verifyThing}`, status: 200 });
        }
    } catch (error) {
        console.error(error);
        let statusCode = 500;
        let message = 'Internal server error.';
        if (error.name === 'ValidationError') {
            statusCode = 400;
            message = error.message;
        } else if (error.code === 11000) {
            statusCode = 409;
            message = 'Duplicate entry found.';
        }
        return res.status(statusCode).json({ message });
    }
});
// export const deleteUser = asyncHandler(async (req, res) => {
//     const { id } = req.body

//     // Confirm data
//     if (!id) {
//         return res.status(400).json({ message: 'User ID Required' })
//     }

//     // Does the user exist to delete?
//     const user = await User.findById(id).exec()

//     if (!user) {
//         return res.status(400).json({ message: 'User not found' })
//     }

//     const result = await user.deleteOne()

//     const reply = `Username ${result.email} with ID ${result._id} deleted`

//     res.json(reply)
// })