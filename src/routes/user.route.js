import express from "express"
import {upload} from "../middlewares/multer.middleware.js"
import {
        registerUser,
        loginUser,
        logoutUser,
        updateDeatails,
        updatePassword,
        updateAvatar
       }  
from "../controllers/user.controller.js"
import {authUser} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.route("/register").post(upload.single("avatar"),registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(authUser,logoutUser)

router.route("/u/update-details").post(authUser,updateDeatails)

router.route("/u/update-password").post(authUser,updatePassword)

router.route("/u/update-avatar").post(authUser,upload.single("avatar"),updateAvatar)

export default router