import {Whishlist} from "../models/whishlist.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudnary} from "../utils/cloudinary.js"


export const getAllWhishList = asyncHandler(async(req,res) => {
        
      const whishlist = await Whishlist.aggregate([
          {
             $match : new mongoose.Types.ObjectId(req.user?._id)
          },
          {
             $lookup : {
                 from : "products",
                 localfeild : "products",
                 forienFeild : "_id",
                 as : "products"
             }
          }
      ])

      if(!whishlist)
      {
         throw new ApiError(400,"error while getting the whishlist")
      }

      return res
            .status(400)
            .json(
                new ApiResponse(
                     whishlist,
                     "here is all user whishlist"
                )
            )
})

export const createWhishList = asyncHandler(async(req,res) => {
     
       const whihlist = await Whishlist.create({
            user : new mongoose.Types.ObjectId(req.user?._id)
       })

       if(!whihlist)
       {
          throw new ApiError(400,"eror while creating a whishList")
       }

       return res
             .status(200)
             .json(
                 new ApiResponse(
                     whihlist,
                     "wihshlist created successfully"
                 )
             )
})

export const addItemToWhishList  = asyncHandler(async(req,res) => {
       const {whishListId, productId} = req.params
       if(!productId || !whishListId)
        {
          throw new ApiError(400,"error whilw getting the id")
        }
      const updatedWhishList = await Whishlist.findByIdAndUpdate(
           whishListId,
           {
               $push : {
                  products : new mongoose.Types.ObjectId(productId)
               }
           },
           {
             new : true
           }
      )

      if(!updatedWhishList)
      {
         throw new ApiError(400,"error while adding the new product into whishlist")
      }

      return res
             .status(200)
             .json(
                 new ApiResponse(
                     updatedWhishList,
                     "product add successfully"
                 )
             )
})

export const removeItemFromWhishlist = asyncHandler(async(req,res) => {
       const {whishListId,productId} = req.params

       if(!productId || !whishListId)
       {
         throw new ApiError(400,"error whilw getting the id")
       }

       const deletedList = await Whishlist.findByIdUpdate(
           whishListId,
            {
                $pull : {
                    products : new mongoose.Types.ObjectId(productId)
                }
            },
            {
                new : true
            }
       )

       if(!deletedList)
       {
         throw new ApiError(400,"error while deleting the item")
       }

       return res
              .status(200)
              .json(
                 new ApiResponse(
                       {},
                       "item deleted Successfully"
                 )
              )
})

export const deleteWhishList = asyncHandler(async(req,res) => {
       const {whishListId} = req.params

       if(!whishListId)
       {
          throw new ApiResponse(400,"error while etting the whihlist id")
       }

       const deletedWhishList = await Whishlist.findByIdAndDelete(whihlist)

       if(!deletedWhishList)
       {
          throw new ApiError(400,"error while deleting the whishlist")
       }

       return res
              .status(200)
              .json(
                 new ApiResponse(
                    {},
                    "whishlist deleted successfully"
                 )
              )
})