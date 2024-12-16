import mongoose from "mongoose";

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
        default: 'customer' // Default role is "customer"
      },
      address : {
          type : String,
          required : true
      }
},{timestamps:true})


export const User = mongoose.model("User",UserSchema)