import mongoose from 'mongoose'
import qrcode from 'qrcode';

const qrCodeSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    planId: { type: Number, required: true },
    code: { type: String, required: true, unique: true }, 
    usageCount: { type: Number, default: 0 }, 
    validityDate: { type: Date, required: true }, // Date when the QR code expires
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'] }, // Specific meal 
    isUsed: { type: Boolean, default: false }, // Flag to indicate if used 
    createdAt: { type: Date, default: Date.now }, // Timestamp of QR code creation 
    // ... (other potential fields)
});
qrCodeSchema.pre('save', async function(next) {
    const doc = this;

    // Generate a unique code (example using userId and timestamp)
    const uniqueString = `${doc.userId}_${Date.now()}`;
    const qrCodeData = await qrcode.toDataURL(uniqueString); // Encode data as URL
    doc.code = qrCodeData; // Assign the generated QR code URL

    next();
});


const QRCode = mongoose.models.qrcode || mongoose.model('qrCode' , qrCodeSchema)

export default QRCode