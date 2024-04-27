import mongoose from 'mongoose'


const qrCodeSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    messId: { type: Number, required: true },
    planId: { type: Number, required: true },
    code: { type: String, required: true, unique: true }, 
    usageCount: { type: Number, default: 0 }, 
    validityDate: { type: Date, required: true }, // Date when the QR code expires
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'] }, // Specific meal
    isUsed: { type: Boolean, default: false }, // Flag to indicate if used 
    createdAt: { type: Date, default: Date.now }, // Timestamp of QR code creation 
    // ... (other potential fields)
});

const QRCode = mongoose.models.qrcode || mongoose.model('qrcodes' , qrCodeSchema)

export default QRCode