// importing router from express
import { Router } from "express";
import {getOneSuperAdmin, registerSuperAdmin} from "../Controller/superadminController.js";
import {getOneUser} from "../Controller/userController.js";
import router from "./userRoute.js";


// importing controller functions

// create router application for taking and providing req and res
const superadminRouter = Router();

// router queries
superadminRouter.post('/register/:userId', registerSuperAdmin);
superadminRouter.get("/getsuperadmin/:email" ,  getOneSuperAdmin)

// exporting router application
export default superadminRouter;