import { Router } from "express";
const messRouter = Router();
import {createMess, getMesses, getMessByEmail,updateMess,deleteMess} from '../controller/messController.js';

messRouter.post('/createmess', createMess);

messRouter.get('/getmess', getMesses);

messRouter.get('/getmessbyemail/:email',getMessByEmail);

messRouter.put('/update/:id', updateMess);

messRouter.delete('/delete/:email', deleteMess);
export default messRouter;
//
// import { Router } from "express";
// const messRouter = Router();
// import {createMess, getMesses, getMessById,updateMess,deleteMess} from '../controller/messController.js';
// import {requireSuperAdmin} from '../middleware/authMiddleware.js';
//
// messRouter.post('/createmess', requireSuperAdmin, createMess);
//
// // Get all messes (protected)
// messRouter.get('/getmess', requireSuperAdmin, getMesses);
//
// // Get a mess by ID (protected)
// messRouter.get('/getmessById/:id', requireSuperAdmin, getMessById);
//
// // Update a mess by ID (protected)
// messRouter.put('/update/:id', requireSuperAdmin, updateMess);
//
// // Delete a mess by ID (protected)
// messRouter.delete('/delete/:id', requireSuperAdmin, deleteMess);
// export default messRouter;
