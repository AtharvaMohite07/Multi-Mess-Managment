import { Router } from 'express'
import { login, logout, refresh, refreshSuperAdmin  } from '../Controller/authController.js'
const authrouter = Router()

authrouter.post("/login" , login)
authrouter.get("/refresh" , refresh)
authrouter.get("/logout" , logout)
authrouter.get("/refreshsuperadmin" , refreshSuperAdmin)

// router.route('/logout')
    // .post(authController.logout)

export default authrouter