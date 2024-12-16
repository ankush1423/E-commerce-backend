import {User} from "../models/user.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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