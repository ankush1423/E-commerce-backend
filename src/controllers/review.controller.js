import { Review } from "../models/review.model.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"


export const createReview = asyncHandler(async(req,res) => {
       const {productId} = req.params
       const {comment,rating} = req.body

       if(!productId || !comment || !rating)
       {
          throw new ApiError(400,"error on getting the productId comment or rating")
       }
       
       const review = await Review.create({
            user : new mongoose.Types.ObjectId(req.user?._id),
            product : new mongoose.Types.ObjectId(productId),
            comment : comment,
            rating : rating
       })

       if(!review)
       {
          throw new ApiError(400,"error while creating a review")
       }

       return res
              .status(200)
              .json(
                 new ApiResponse(
                      review,
                      "review created successFully"
                 )
              )

})

