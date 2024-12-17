import {Product} from "../models/product.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudnary} from "../utils/cloudinary.js"


export const getAllProducts = asyncHandler(async(req,res) => {
       const {page = 1 , limit =10 , category , sort , sortBy = "price"} = req.query

       const products = await Product.find({category : category}).skip((page-1)*limit).sort(sortBy)

       if(!products)
       {
           throw new ApiError(400,"error while getting the all Products")
       }
        
       return res
              .status(200)
              .json(
                  new ApiResponse(
                      products,
                      "all products"
                  )
              )

})

export const getProduct = asyncHandler(async(req,res) => {
     const {productId} = req.params

     if(!productId)
     {
        throw new ApiResponse(400,"please provide the productId")
     }

     const product = await Product.findById(productId)

     if(!product)
     {
        throw new ApiResponse(400,"error while getting the product")
     }

     return res
           .status(200)
           .json(
              new ApiResponse(
                  product,
                  "product found successfully"
              )
           )
})

export const createProduct = asyncHandler(async(req,res) => {

       const {name , description , price , category , stock  } = req.body

       if(
           [name , description , price , category , stock ].some(feild => feild?.trim() === "")
       ){
           throw new ApiError(400,"all feilds are rquired")
       }

       const imageLocalPath = req.file?.path

       if(!imageLocalPath)
       {
           throw new ApiError(400,"error on finding the image")
       }

       const imageRefrence = await uploadOnCloudnary(imageLocalPath)

       if(!imageRefrence)
       {
           throw new ApiError(400,"error while getting the imagerefrence")
       }

       const product = await Product.create(
          {
              name,
              description,
              price : Number(price),
              category ,
              stock : Number(stock),
              image : imageRefrence?.url || "",
              vandor : new mongoose.Types.ObjectId(req.user?._id)
          }
       )

       if(!product)
       {
          throw new ApiError(400,"error while creating the product")
       }

       return res
              .status(400)
              .json(
                 new ApiResponse(
                     product,
                     "product created successfully"
                 )
              )
})

export const updateProduct = asyncHandler(async(req,res) => {
      const {productId} = req.params
      const {name , description , price , stock , category } = req.body

      if(
         [name , description , price , stock ,category ].some(feild => feild?.trim() === "")
      ){
          throw new ApiError(400,"please provide the feilds")
      }

      if(!productId)
      {
         throw new ApiError(400,"please provide the productId")
      }

      const updatedProduct = await Product.findByIdAndUpdate(
           productId,
           {
              $set : {
                 name,
                 description,
                 price : Number(price),
                 stock : Number(stock)
              }
           },
           {
              new : true
           }
      )

      if(!updatedProduct)
      {
          throw new ApiError(400,"error while updating the product")
      }

      return res
             .status(200)
             .json(
                 new ApiResponse(
                     updatedProduct,
                     "product updated successfully"
                 )
             )
})

export const deleteProduct = asyncHandler(async(req,res) => {
      const {productId} = req.params

      if(!productId)
      {
         throw new ApiError(400,"error while getting the productId")
      }

      const deletedProduct = await Product.findByIdAndDelete(productId)

      if(!deletedProduct)
      {
         throw new ApiError(400,"error while deletng the product")
      }

      return res
             .status(200)
             .json(
                 new ApiResponse(
                     {},
                     "product deleted successfully"
                 )
             )
})