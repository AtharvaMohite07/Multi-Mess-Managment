import QRCode from '../Models/QRCode.js';
import qrcode from 'qrcode';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { updateDailyEntry } from '../Controller/dailyentryController.js';

// Encryption Key (replace with your secure key)
import * as crypto from 'crypto';

//const encryptionKey = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit key
//const encryptionKey = 'appleadaykeepsdoctoraway'
const encryptionKey = 'de4f927dc1e812d74cab41efcf22c5ac9d866ba2befa9d7f1602287723e2b0e4';

//console.log(encryptionKey);

export async function generateQRCode(userId, messId, planId, validityDate, mealType) {
    return new Promise(async (resolve, reject) => {
        try {
            // Check for required fields
            if (!userId || !messId || !planId || !validityDate || !mealType) {
                resolve({
                        message: 'Missing required fields.'
                    }
                );
            }

            // Encrypt the data before generating the QR code
            const dataToEncrypt = JSON.stringify({userId, planId, mealType});
            console.log(dataToEncrypt);
            const code = CryptoJS.AES.encrypt(dataToEncrypt, encryptionKey).toString();
            console.log(code);


            // Create a new QRCode document
            const newQRCode = new QRCode({
                userId,
                messId,
                planId,
                validityDate,
                mealType,
                code // Store the generated QR code data URL
            });

            // Save the QRCode document
            await newQRCode.save();

            resolve({
                message: 'QR code generated successfully.',
                code
            });
        } catch (err) {
            console.error(err);
            reject({
                message: 'Internal server error.'
            });
        }
    })

};
export async function validateQRCode(req, res) {
    try {
        // Access the 'text' property from the request body
        const { code } = req.body; // Access the 'text' property from the request body
        console.log("QR Code Text:", code);


        // Fetch the QR code document from the database based on the received QR code
        const qrCode = await QRCode.findOne({code});
        // Check if a QR code document is found for the provided raw data
        if (!qrCode) {
            return res.status(400).json({ message: 'QR code not found in the database.' });
        }

        // Extract the userId, planId, mealType, and validityDate from the QR code document
        const { userId, planId, mealType, validityDate, messId } = qrCode;

        // Check if the QR code is expired
        if (validityDate < Date.now()) {
            return res.status(400).json({ message: 'QR code expired.' });
        }

        // Check if the QR code has exceeded the usage limit (example: 2 uses per day)
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);
        const todaysUsage = await QRCode.countDocuments({
            userId: parseInt(userId),
            mealType,
            updatedAt: { $gte: todayStart, $lte: todayEnd }
        });

        if (todaysUsage >= 1) {
            return res.status(400).json({ message: 'QR code usage limit exceeded for today.' });
        }

        // Update the usage count and 'isUsed' flag for the QR code
        qrCode.usageCount++;
        qrCode.isUsed = true;
        await qrCode.save();
        const verifyThing = mealType;

        const requestBody = {
            body: {
                userId: userId,
                verifyThing: verifyThing,
                planId: planId,
                messId: messId
            }
        };


        const updateResult = await updateDailyEntry(requestBody, res);

        // Placeholder response for successful validation
        if (!updateResult || typeof updateResult.status === 'undefined') {
            console.error('Invalid response from updateDailyEntry');
            return res.status(500).json({ message: 'Internal server error during attendance update.' });
        }
        if (updateResult.status === 200) {
            // Success response from updateDailyEntry
            return res.status(200).json({
                message: 'Attendance Taken Successfully.', // New message
                userId,
                planId,
                type: mealType,
                messId,
                alreadyUsed: false,
                success: true
            });

        }
        else if (updateResult.status === 300) { // Specific 400 error handling
        const errorMessage = updateResult.message || "Attendance already marked or invalid QR code.";
        return res.status(300).json({message: errorMessage, alreadyUsed: true, success: false});}
        else {
            // Error response from updateDailyEntry - updateResult.status
            return res.status(updateResult.status).json({
                message: updateResult.message,
                alreadyUsed: false, // Or set true if appropriate
                success: false
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


export async function showQRCode(req, res) {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId } = req.params;

            // Find all QR codes associated with the user in the database
            const qrCodes = await QRCode.find({ userId });

            if (!qrCodes || qrCodes.length === 0) {
                resolve(res.status(404).json({ message: 'QR codes not found for the user.' }));
                return; // Prevent further execution
            }

            // Extract the meal type and QR code URLs of all QR codes
            const qrCodeData = qrCodes.map(qrCode => ({
                mealType: qrCode.mealType,
                validityDate: qrCode.validityDate,
                qrCode: qrCode.code
            }));

            resolve(res.json({ qrCodes: qrCodeData }));
            // ... (choose one of the display options below) ...

        } catch (err) {
            console.error(err);
            reject(res.status(500).json({ message: 'Internal server error.' }));
        }
    });
}



export default {
    generateQRCode,
    validateQRCode,
    showQRCode
};