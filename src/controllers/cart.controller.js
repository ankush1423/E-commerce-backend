import {Cart} from "../models/cart.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"




export const getCart = asyncHandler(async(req,res) => {
        const {cartId} = req.params

        if(!cartId)
        {
             throw new ApiError(400,"error while getting the cartId")
        }

        const cart = await Cart.findOne({_id : cartId})

        if(!cart)
        {
            throw new ApiError(400,"error while getting the cart")
        }
        
        return res
              .status(200)
              .json(
                 new ApiResponse(
                      cart,
                      "all carts are here"
                 )
              )

})
export const createCart = asyncHandler(async(req,res) => {
      
    const cart = await Cart.create(
        {
            user : new mongoose.Types.ObjectId(req.user?._id)
        }
    )

    if(!cart)
    {
        throw new ApiError(400,"error while crating cart")
    }

    return res
           .status(200)
           .json(
              new ApiResponse(
                  cart,
                  "cart created successfully"
              )
           )
})

export const addItemtoCart = asyncHandler(async(req,res) => {
       const {cartId,productId} = req.params
       const {quantity} = req.body

       if(!productId || !quantity)
       {
           throw new ApiError(400,"error while getting the productId and quntity")
       }

       const updatedCart = await Cart.findByIdAndUpdate(
              cartId,
              {
                 $push : {
                     products : {
                         type : new mongoose.Types.ObjectId(productId),
                         quantity : quantity
                     }
                 }
              },
              {
                  new : true
              }
       )

       if(!updatedCart)
       {
           throw new ApiError(400,"errror while updating the cart")
       }

       return res
              .status(200)
              .json(
                 new ApiResponse(
                     updatedCart,
                     "cart updated successfully"
                 )
              )
})

export const removeItemCart = asyncHandler(async(req,res) => {
      const {cartId , productId}  = req.params

      if(!cartId || !productId)
      {
         throw new ApiError(400,"error while getting the cartId and productId")
      }

      const cart = await Cart.findByIdAndUpdate(
           cartId,
           {
               $pull : {
                  products : new mongoose.Types.ObjectId(productId)
               }
           },
           {
               new : true
           }
      )

      if(!cart)
      {
          throw new ApiError(400,"error while remove the product from cart")
      }

      return res
             .status(200)
             .json(
                 new ApiResponse(
                      cart,
                      "item remove successfully"
                 )
             )
})

export const deleteCart = asyncHandler(async(req,res) => {
      const {cartId} = req.params
      
      if(!cartId)
      {
          throw new ApiError(400,"error while getting the id")
      }

      const deletedCart = await Cart.findByIdAndDelete(cartId)

      if(!deleteCart)
      {
          throw new ApiError(400,"error while deleting the cart")
      }

      return res
             .status(200)
             .json(
                 new ApiResponse(
                      {},
                      "cart deleted successfully"
                 )
             )
}) 