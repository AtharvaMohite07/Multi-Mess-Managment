// importing router from express
import { Router } from "express";
import { addMenu, deleteMenu, getMenu, updateMenu } from "../Controller/menuController.js";

// importing controller functions

// create router application for taking and providing req and res
const menuRoute = Router();

// router queries
menuRoute.get("/getMenu/:menu_day/:id" ,  getMenu)
menuRoute.post("/addMenu/:id" , addMenu)
menuRoute.patch("/updateMenu/:id" , updateMenu)
menuRoute.delete("/deleteMenu/:id" , deleteMenu)

// exporting router application
export default menuRoute;