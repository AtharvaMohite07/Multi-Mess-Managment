import QRCode from '../models/QRCode.js';
import qrcode from 'qrcode'; 
import CryptoJS from 'crypto-js'; 

// Encryption Key (replace with your secure key)
import * as crypto from 'crypto';

const encryptionKey = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit key
console.log(encryptionKey);
//const encryptionKey = 'appleadaykeepsdoctorsaway';

export async function generateQRCode(req, res) {
    try {
        const { userId, planId, validityDate, mealType } = req.body;

        // Check for required fields
        if (!userId || !planId || !validityDate || !mealType) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Encrypt the data before generating the QR code
        const dataToEncrypt = JSON.stringify({ userId, planId });
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

        res.status(201).json({ 
            message: 'QR code generated successfully.', 
            qrCode: newQRCode 
        }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
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
        const { userId, planId } = JSON.parse(decryptedData);

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

        if (todaysUsage >= 2) { 
            return res.status(400).json({ message: 'QR code usage limit exceeded for today.' });
        }

        // Update the usage count and 'isUsed' flag
        qrCode.usageCount++;
        qrCode.isUsed = true;
        await qrCode.save();

        res.json({ message: 'QR code validated successfully.' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export default {
    generateQRCode,
    validateQRCode 
};