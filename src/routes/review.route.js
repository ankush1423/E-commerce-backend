import express from "express"
import {
       createReview,
      } from "../controllers/review.controller.js"

const router = express.Router()

router.route("/:productId").post(createReview)

export default router