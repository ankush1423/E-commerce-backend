import express from "express"
import {authUser} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.use(authUser)




export default router