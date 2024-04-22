import SuperAdmin from '../Models/SuperAdmin.js';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';

export const registerSuperAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if a user with the same email already exists
    const existingUser = await SuperAdmin.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if password and confirm password match
    if (password !== cpassword) {
        return res.status(409).json({ message: 'Confirm password does not match with password' });
    }

    try {
        // Hash the password
        const saltRounds = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new superadmin user
        const newSuperAdmin = new SuperAdmin({
            name,
            email,
            password: hashedPassword,
            cpassword:hashedPassword,
            role: 3,
            isSuperAdmin: true
        });

        // Save the user to the database
        await newSuperAdmin.save();

        res.status(201).json({ message: 'Superadmin user created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating superadmin user' });
    }
});
export const getOneSuperAdmin = asyncHandler(async (req, res) => {
    const email = req.params.email;

    // Confirm data
    if (!email) {
        return res.status(400).json({ message: 'Email Required' });
    }

    const superadmin = await SuperAdmin.findOne({"email":email }, { password: 0, cpassword: 0 }).lean();

    // If no superadmin found
    if (!superadmin) {
        return res.status(400).json({ message: 'Superadmin not found' });
    }

    res.json(superadmin);
});