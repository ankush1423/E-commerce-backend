import {User} from "../models/user.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
     try 
     {     
           const user = await User.findById(userId)
           const accessToken = await user.generateAccessToken()
           const refreshToken = await user.generateRefreshToken()

           user.refreshToken = refreshToken
           await user.save({validateBeforeSave : false}) 
           return {accessToken,refreshToken}           
     }
     catch (error) 
     {
         console.log("ERROR WHILE GENERATING THE TOKEN ",error)
     }
}

export const registerUser = asyncHandler(async (req,res) => {
     const {name , email , password , avatar , role ,address} = req.body

     if(
        [name , email , password , avatar , role , address ].some(feild => feild?.trim() === "")
     ){
         throw new ApiError(400,"all feilds are mandotary")
     }
     
     const avatarPath = req.file?.path

     if(!avatarPath)
     {
        throw new ApiError(400,"error while getting the avatar path")
     }

     const avatarRefrence = await uploadOnCloudinary(avatarPath)
      
     if(!avatarRefrence)
     {
        throw new ApiError(400,"error on uploding the avatar path")
     }

     const user = await User.create(
        {
            name,
            email,
            password,
            avatar : avatarRefrence?.url || "",
            role,
            address
        }
     )

     if(!user)
     {
        throw new ApiError(400,"error while creating a user")
     }

     return res
            .status(200)
            .json(
                new ApiResponse(
                     user,
                     "user register sucssesfully"
                )
            )
})

export const loginUser = asyncHandler(async(req,res) => {
      const {email , password} = req.body

      if(!email || !password)
      {
         throw new ApiError(400,"both feilds are required")
      }

      const user = await User.findOne({email : email})

      if(!user)
      {
         throw new ApiError(400,"no user with this email id")
      }

      const isPasswordCorrect = await user.isPasswordCorrect(password)

      if(!isPasswordCorrect)
      {
         throw new ApiError(400,"please provide valid password")
      }

      const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

      const loggedInUser  = await User.findById(user._id).select("-password -refreshToken")

      if(!loggedInUser)
      {
         throw new ApiError(400,"error on finding the loggedInUser")
      }

      const options = {
         httpOnly : true,
         secure : true
      }

      return res
             .status(200)
             .cookie("accessToken",accessToken,options)
             .cookie("refreshToken",refreshToken,options)
             .json(
                new ApiResponse(
                     loggedInUser,
                     "user logged In Successfully"
                )
             )
})

export const logoutUser = asyncHandler(async(req,res) => {
     return res
           .status(200)
           .clearCookie("accessToken")
           .clearCookie("refreshToken")
           .json(
              new ApiResponse(
                   {},
                   "user loggedOut Successfully"
              )
           )
})

export const updateDeatails = asyncHandler(async(req,res) => {
      const {name , email , address} = req.body

      if(!name || !email || !address)
      {
         throw new ApiError(400,"all feilds are required")
      }

      const user = await User.findByIdAndUpdate(
           req.user?._id,
           {
              name,
              email,
              address
           },
           {
              new : true
           }
      ).select("-password -refreshToken")
      if(!user)
      {
         throw new ApiError(400,"error while updaing the user")
      }

      return res
             .status(200)
             .json(
                new ApiResponse(
                      user,
                      "user updated successfully"
                )
             )

})

export const updatePassword = asyncHandler(async(req,res) => {

      const {oldPassword,newPassword} = req.body

      if(!oldPassword || !newPassword)
      {
          throw new ApiError(400,"both feilds are required")
      }
      
      const user = await User.findById(req.user?._id)
      if(!user)
      {
         throw new ApiError(400,"errror on geting the user")
      }
      const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

      if(!isPasswordCorrect)
      {
         throw new ApiError(400,"please provide the correct Password")
      }
       
      user.password = newPassword
      await user.save({validateBeforeSave : false})

      return res
             .status(200)
             .json(
                 new ApiResponse(
                     {},
                     "password updated successfully"
                 )
             )
})

export const updateAvatar = asyncHandler(async(req,res) => {

       const avatarLocalPath = req.file?.path

       if(!avatarLocalPath)
       {
            throw new ApiError(400,"error whiile getting the avatarLocalPath")
       }
       
       const avatarRefrence = await uploadOnCloudinary(avatarLocalPath)
       
       const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
             $set : {
                avatar : avatarRefrence?.url || ""
             }
          },
          {
            new : true
          }
       ).select("-password -refreshToken")

       if(!user)
       {
          throw new ApiError(400,"error on updating the user")
       }

       return res
              .status(200)
              .json(
                 new ApiResponse(
                     {},
                     "avatar updated successfully"
                 )
              )
})

export const refreshAccessToken = asyncHandler(async(req,res) => {
       
       const incomingRefreshToken = req.cookies?.refreshToken || req.body

       if(!incomingRefreshToken)
       {
          throw new ApiError(400,"error on getting the refresh token")
       }

       const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
       
       const user = await User.findById(decodedToken._id)

       if(!user)
       {
           throw new ApiError(400,"error while getting he user")
       }

       if(incomingRefreshToken !== user?.refreshToken)
       {
           throw new ApiError(400,"token is already used or invalid token")
       }

       const {accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id)

       const options = {
           httpOnly : true,
           secure : true
       }

       return res
              .status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",refreshToken.options)
              .json(
                 new ApiResponse(
                      {},
                      "accesss and refresh tokens are refresh"
                 )
              )
})