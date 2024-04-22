import { Router } from "express";
const messRouter = Router();
import {createMess, getMesses, getMessById,updateMess,deleteMess} from '../controller/messController.js';
import {requireSuperAdmin} from '../middleware/authMiddleware.js';

messRouter.post('/createmess', requireSuperAdmin, createMess);

// Get all messes (protected)
messRouter.get('/', requireSuperAdmin, getMesses);

// Get a mess by ID (protected)
messRouter.get('/:id', requireSuperAdmin, getMessById);

// Update a mess by ID (protected)
messRouter.put('/:id', requireSuperAdmin, updateMess);

// Delete a mess by ID (protected)
messRouter.delete('/:id', requireSuperAdmin, deleteMess);
export default messRouter;