// importing inventoryRoute from express
import { Router } from "express";
import { addInventory, deleteInventory, getInventory, getStore, updateInventory } from "../Controller/inventoryController.js";

// importing controller functions

// create inventoryRoute application for taking and providing req and res
const inventoryRoute = Router();

// inventoryRoute queries
// inventoryRoute.get("/getusers" ,  getAllUser)
inventoryRoute.get("/getstore/:storeType/:id" ,  getStore)
inventoryRoute.get("/getinventory/:inventoryId/:id" ,  getInventory)
inventoryRoute.post("/addinventory/:id" , addInventory)
inventoryRoute.patch("/updateinventory/:inventoryId/:id" , updateInventory)
inventoryRoute.delete("/deleteinventory/:inventoryId/:id" , deleteInventory)
// inventoryRoute.patch("/resetpasswd" , resetPassword)
// inventoryRoute.get("/verify" ,  d)

// exporting inventoryRoute application
export default inventoryRoute;