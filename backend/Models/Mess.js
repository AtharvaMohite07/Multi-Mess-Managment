import mongoose from 'mongoose';

// import User from "./User.js"; // Remove this import - it's not used in this file

const messSchema = new mongoose.Schema({
    messId: {
        type: Number,
        default: 1000
    },
    messName: { type: String, required: true, unique: true },
    location: { type: String },
    capacity: { type: Number },
    contactPerson: {
        name: { type: String },
        phoneNumber: { type: String },
        email: {
            type: String,
            required: [true, 'Please enter an email'],
            unique: [true, 'Email already exists'],
        }
    },
    menuType: { type: String, enum: ['Veg', 'Non-Veg', 'Both'] },
    timings: {
        breakfast: { type: String },
        lunch: { type: String },
        dinner: { type: String }
    },
    isActive: { type: Boolean, default: true }


});

messSchema.pre('save', async function (next) {
    const docs = this;
    const data = await Mess.find();
     // Get count of existing messes
    docs.messId =  docs.messId+data.length; // Assign messId as count + 1
    next();
});

const Mess = mongoose.models.Mess || mongoose.model('Mess', messSchema);

export default Mess;