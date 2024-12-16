import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"

const UserSchema = new mongoose.Schema({
      name : {
         type : String,
         required : true,
         trim : true,
         minlength : 3,
         maxlength : 12
      },
      email: {
        type: String, 
        required: [true, "Email is required"],
        unique: true, 
        trim: true, 
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // Regular expression for email validation
          "Please enter a valid email address" // Custom error message for invalid email
        ]
      },
      password: {
        type: String, 
        required: [true, "Password is required"], 
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [128, "Password cannot exceed 128 characters"], 
        trim: true
      },
      avatar : {
         type : String,
         required : true
      }, 
      role: {
        type: String,
        enum: ['customer', 'seller', 'admin'],
        default: 'customer' 
      },
      address : {
          type : String,
          required : true
      },
      refreshToken : {
          type : String
      }
},{timestamps:true})

UserSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    const gensalt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password,gensalt)
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password) {
      const isPasswordCorrect = await bcryptjs.compare(password,this.password)
      return isPasswordCorrect
}

UserSchema.methods.generateAccessToken =  function() {
      return jwt.sign(
        {
           _id : this._id,
           email : this.email,
           name : this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
           expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
      )
}

UserSchema.methods.generateRefreshToken = function () {
     return jwt.sign(
        {
           _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
           expiresIn : process.env.REFRESH_TOKEN_EXPIRY 
        }
     )
}

export const User = mongoose.model("User",UserSchema)