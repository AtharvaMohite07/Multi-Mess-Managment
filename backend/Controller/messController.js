import Mess from '../models/Mess.js';
import asyncHandler from 'express-async-handler';
export async function createMess(req, res) {
    const {
        messName,
        location,
        capacity,
        ContactPersonName,  // Assuming you get the contact person's name in the request body
        ContactPersonPhoneNumber,
        ContactPersonEmail,
        menuType,
        isActive
    } = req.body;

    try {
        const newMess = new Mess({
            messName,
            location,
            capacity,
            contactPerson: {
                name: ContactPersonName,
                phoneNumber: ContactPersonPhoneNumber,
                email: ContactPersonEmail
            },
            menuType,
            isActive
        });

        await newMess.save();
        res.status(201).json({ message: 'Mess created successfully', mess: newMess });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating mess' });
    }
}

export async function getMesses(req, res) {
    try {
        const messes = await Mess.find();
        res.json(messes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving messes' });
    }
}
export async function getMessByEmail(req, res) {
    try {
        const email = req.params.email;
        const mess = await Mess.findOne({email});
        console.log(mess);
        if (!mess) {
            return res.status(404).json({ message: 'Mess not found' });
        }
        res.json(mess);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving mess' });
    }
}

export async function getMessById(req, res) {
    try {
        const mess = await Mess.findOne({ messId: req.params.id });
        console.log(req.params.id);
        if (!mess) {
            return res.status(404).json({ message: 'Mess not found' });
        }
        res.json(mess.messName);
        console.log(mess.messName);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving mess' });
    }
}
export async function updateMess(req, res){
    try {
        const messId = req.params.id;
        const {
            messName,
            location,
            capacity,
            contactPersonName,
            contactPersonPhoneNumber,
            contactPersonEmail,
            menuType,
            isActive
        } = req.body;

        const updatedMess = await Mess.findByIdAndUpdate(
            messId,
            {
                messName,
                location,
                capacity,
                contactPerson: {
                    name: contactPersonName,
                    phoneNumber: contactPersonPhoneNumber,
                    email: contactPersonEmail
                },
                menuType,
                isActive
            },
            { new: true }
        );

        if (!updatedMess) {
            return res.status(404).json({ message: 'Mess not found' });
        }
        res.json({ message: 'Mess updated successfully', mess: updatedMess });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating mess' });
    }
}
export const deleteMess = asyncHandler(async (req, res) => {
    const messEmail = req.params.email;

    // Validate if the email is provided
    if (!messEmail) {
        return res.status(400).json({ message: 'Mess Email Required' });
    }

    // Check if the mess exists
    const mess = await Mess.findOne({ email: messEmail }).exec();

    if (!mess) {
        return res.status(400).json({ message: 'Mess not found' });
    }

    // Delete the mess
    const result = await Mess.deleteOne({ email: messEmail });

    // Construct response message
    const reply = `Mess ${messEmail} deleted`;

    res.json({ message: reply });
});