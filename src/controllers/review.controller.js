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

export const updateReview = asyncHandler(async(req,res) => {
       const {reviewId} = req.params
       const {comment , rating} = req.body

       if(!reviewId || !comment || !rating)
       {
           throw new ApiError(400,"error while getting the details")
       }

       const updatedReview = await Review.findByIdAndUpdate(
             reviewId,
             {
                $set : {
                   comment : comment,
                   rating : rating
                }
             },
             {
                new : true
             }
       )

       if(!updatedReview)
       {
          throw new ApiError(400,"error while updating the review")
       }

       return res
              .status(200)
              .json(
                  new ApiResponse(
                      updatedReview,
                      "review Updated successfully"
                  )
              )
})

export const deleteReview = asyncHandler(async(req,res) => {
      const {reviewId} = req.params

      if(!reviewId)
      {
         throw new ApiError(400,"error while geting the reviewID")
      }

      const deletedReview = await Review.findByIdAndDelete(reviewId)

      if(!deletedReview)
      {
          throw new ApiError(400,"error while deleting the Review")
      }
      
      return res
             .status(200)
             .json(
                new ApiResponse(
                     {},
                     "review deleted successfully"
                )
             )

})


