import { Router } from 'express'
import {getUserEntryDetail, updateDailyEntry } from '../Controller/dailyentryController.js'
const dailyentryRouter = Router()

dailyentryRouter.patch("/updateentry" , updateDailyEntry)
dailyentryRouter.get("/getuserentry/:userId/:id" , getUserEntryDetail)
// dailyentryRouter.get("/deleteentry" , deleteUserEntry)


// router.route('/logout')
    // .post(authController.logout)

export default dailyentryRouter