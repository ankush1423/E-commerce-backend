import jwt from "jsonwebtoken"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"

const auth = asyncHandler(async (req,res,next) => {
      try 
      {
          const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
          
          if(!token)
          {
             throw new ApiError(400,"error while auth token")
          }

          const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

          const user = await User.findById(decodedToken._id)

          if(!user)
          {
               throw new ApiError(400,"errror while verifying the token")
          }

          req.user = user
          next()         
      }
      catch(error) 
      {
          throw new ApiError(400,error?.message|| "error onm authraise the token")
      }
})

export {auth}