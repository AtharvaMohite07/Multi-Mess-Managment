import Mess from '../models/Mess.js';
import asyncHandler from 'express-async-handler';
export async function createMess(req, res) {
    const {
        messName,
        location,
        capacity,
        contactPersonName,  // Assuming you get the contact person's name in the request body
        contactPersonPhoneNumber,
        menuType,
        isActive
    } = req.body;

    try {
        const newMess = new Mess({
            messName,
            location,
            capacity,
            contactPerson: {
                name: contactPersonName,
                phoneNumber: contactPersonPhoneNumber
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
};

export async function getMesses(req, res) {
    try {
        const messes = await Mess.find();
        res.json(messes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving messes' });
    }
};
export async function getMessById(req, res) {
    try {
        const messId = req.params.id;
        const mess = await Mess.findById(messId);
        if (!mess) {
            return res.status(404).json({ message: 'Mess not found' });
        }
        res.json(mess);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving mess' });
    }
};
export async function updateMess(req, res){
    try {
        const messId = req.params.id;
        const {
            messName,
            location,
            capacity,
            contactPersonName,
            contactPersonPhoneNumber,
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
                    phoneNumber: contactPersonPhoneNumber
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
};
export async function deleteMess(req, res) {
    try {
        const messId = req.params.id;
        const deletedMess = await Mess.findByIdAndDelete(messId);
        if (!deletedMess) {
            return res.status(404).json({ message: 'Mess not found' });
        }
        res.json({ message: 'Mess deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting mess' });
    }
};