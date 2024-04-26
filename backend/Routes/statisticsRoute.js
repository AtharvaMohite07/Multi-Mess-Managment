// importing router from express
import { Router } from "express";
import { getDayMemebr, getMonthlyExpenses, getPlanCount, getWeekProfit } from "../Controller/statisticalController.js";

// importing controller functions

// create router application for taking and providing req and res
const statisticsRoute = Router();

// router queries
statisticsRoute.get("/getPlanCount/:id" ,  getPlanCount)
statisticsRoute.get("/getDayMember/:id" ,  getDayMemebr)
statisticsRoute.get("/getWeekProfit/:id" ,  getWeekProfit)
statisticsRoute.get("/getMonthlyExpenses/:id" ,  getMonthlyExpenses)

// exporting router application
export default statisticsRoute;