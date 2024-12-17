import express from "express"
import {
       createReview,
       updateReview,
       deleteReview
      } from "../controllers/review.controller.js"
import {authUser} from "../middlewares/auth.middleware.js"


const router = express.Router()

router.use(authUser)

router.route("/:productId").post(createReview).patch(updateReview).delete(deleteReview)
 
export default router