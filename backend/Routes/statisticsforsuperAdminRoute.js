// importing router from express
import { Router } from "express";
import { getUserCountPerMess, getOverallUserDistribution, getTotalMessCount } from "../Controller/statisticalforsuperAdminController.js";

// importing controller functions

// create router application for taking and providing req and res
const statisticsforsuperAdminRoute = Router();

// router queries
statisticsforsuperAdminRoute.get("/getUserCountPerMess" ,  getUserCountPerMess)
statisticsforsuperAdminRoute.get("/getOverallUserDistribution" ,  getOverallUserDistribution)
statisticsforsuperAdminRoute.get("/getTotalMessCount" ,  getTotalMessCount)

// exporting router application
export default statisticsforsuperAdminRoute;