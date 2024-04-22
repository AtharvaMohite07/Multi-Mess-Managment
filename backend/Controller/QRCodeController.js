import QRCode from '../Models/QRCode.js';
import qrcode from 'qrcode';
import CryptoJS from 'crypto-js';
import { updateDailyEntry } from './DailyEntryController.js';

// Encryption Key (replace with your secure key)
import * as crypto from 'crypto';

//const encryptionKey = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit key

//const encryptionKey = 'appleadaykeepsdoctorsaway';
const encryptionKey = 'de4f927dc1e812d74cab41efcf22c5ac9d866ba2befa9d7f1602287723e2b0e4';

console.log(encryptionKey);

export async function generateQRCode(userId, planId, validityDate, mealType) {
    return new Promise(async (resolve, reject) => {
        try {
            // Check for required fields
            if (!userId || !planId || !validityDate || !mealType) {
                resolve({
                        message: 'Missing required fields.'
                    }
                );
            }

            // Encrypt the data before generating the QR code
            const dataToEncrypt = JSON.stringify({userId, planId});
            const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, encryptionKey).toString();

            // Generate the QR code
            const qrCodeDataUrl = await qrcode.toDataURL(encryptedData);
            const qrCodeData = qrCodeDataUrl.split(',')[1];


            // Create a new QRCode document
            const newQRCode = new QRCode({
                userId,
                planId,
                validityDate,
                mealType,
                code: qrCodeData // Store the generated QR code data URL
            });

            // Save the QRCode document
            await newQRCode.save();

            resolve({
                message: 'QR code generated successfully.',
                qrCode: newQRCode
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
        const { code } = req.body;

        // Find the QR code in the database
        const qrCode = await QRCode.findOne({ code });

        if (!qrCode) {
            return res.status(404).json({ message: 'QR code not found.' });
        }
        const qrCodeDataUrl = `data:image/png;base64,${code}`;

        // Decrypt the QR code data
        const decryptedData = CryptoJS.AES.decrypt(qrCodeDataUrl, encryptionKey).toString(CryptoJS.enc.Utf8);

        // Parse the decrypted data
        const { userId, planId , mealType } = JSON.parse(decryptedData);

        // Check if the QR code is still valid
        if (qrCode.validityDate < Date.now()) {
            return res.status(400).json({ message: 'QR code expired.' });
        }

        // Check if the QR code has exceeded usage limit (example: 2 uses per day)
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);
        const todaysUsage = await QRCode.countDocuments({
            _id: qrCode._id,
            usageCount: { $gt: 0 }, // Check for at least one use
            updatedAt: { $gte: todayStart, $lte: todayEnd }
        });

        if (todaysUsage >= 1) {
            return res.status(400).json({ message: 'QR code usage limit exceeded for today.' });
        }

        // Update the usage count and 'isUsed' flag
        qrCode.usageCount++;
        qrCode.isUsed = true;
        await qrCode.save();
        await updateDailyEntry(userId, mealType, planId);

        res.json({ message: 'QR code validated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
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