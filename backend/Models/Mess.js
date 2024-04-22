import mongoose from 'mongoose';
// import User from "./User.js"; // Remove this import - it's not used in this file

const messSchema = new mongoose.Schema({
    messName: { type: String, required: true, unique: true },
    location: { type: String },
    capacity: { type: Number },
    contactPerson: {
        name: { type: String },
        phoneNumber: { type: String }
    },
    menuType: { type: String, enum: ['Veg', 'Non-Veg', 'Both'] },
    timings: {
        breakfast: { type: String },
        lunch: { type: String },
        dinner: { type: String }
    },
    isActive: { type: Boolean, default: true }
});

messSchema.pre('save', function(next) {
    const mess = this;
    if (!mess.messId) {
        const { v4: uuidv4 } = require('uuid'); // Move require inside the pre-save hook
        mess.messId = uuidv4();
    }
    next();
});

const Mess = mongoose.models.Mess || mongoose.model('Mess', messSchema);

export default Mess;