import mongoose from 'mongoose';
import validator from 'validator';

const superAdminSchema = new mongoose.Schema({
    userId: {
        type: Number,
        default: 3000,
    },
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: [true, 'Email already exists'],
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    cpassword : {
        type : String,
        required : [true , "Please enter an confirm password"],
    },
    isSuperAdmin: { type: Boolean, default: true },
    role: {
        type: Number,
        required: true,
        default: 3
    }

});
superAdminSchema.pre('save', async function (next) {
    if (this.isNew && !this.userId) {
        try {
            // Find the highest existing userId and increment by 1
            const highestUserIdDoc = await SuperAdmin.findOne().sort({ userId: -1 }).select('userId');
            const highestUserId = highestUserIdDoc ? highestUserIdDoc.userId : 2999; // Default to 2999 if no document found
            this.userId = highestUserId + 1;
        } catch (error) {
            console.error('Error finding highest userId:', error);
            // Handle error, maybe call next with an error or perform other actions
        }
    }
    next();
});
const SuperAdmin = mongoose.models.SuperAdmin || mongoose.model('SuperAdmin', superAdminSchema);

export default SuperAdmin;