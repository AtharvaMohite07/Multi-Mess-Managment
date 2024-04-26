// importing router from express
import { Router } from "express";
import { addPlan, deletePlan, getAllPlan, getPlan, updatePlan } from "../Controller/planController.js";

// importing controller functions

// create router application for taking and providing req and res
const planRoute = Router();

// router queries
planRoute.get("/getPlan/:plan_type/:id" ,  getPlan)
planRoute.get("/getAllPlan/:id" ,  getAllPlan)
planRoute.post("/addPlan/:id" , addPlan)
planRoute.patch("/updatePlan" , updatePlan)
planRoute.delete("/deletePlan/:id" , deletePlan)

// exporting router application
export default planRoute;