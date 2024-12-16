import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
       name : {
           type : String,
           required : true,
           trim : true,
       },
       description : {
           type : String,
           required : true,
           minlength : 6,
           maxlength : 120,
       },
       price : {
           type : Number,
           required : true,
       },
       category : {
            type : String,
            required : true
       },
       stock : {
           type : Number,
           required : true
       },
       image : {
           type : String,
           required : true
       },
       reviews : [
           {
              type : mongoose.Schema.Types.ObjectId,
              ref : "Review",
           }
       ],
       vendor :  {
           type : mongoose.Schema.Types.ObjectId,
           ref : "User"
       }
},{timestamps : true})

export const Product = mongoose.model("Product",ProductSchema)