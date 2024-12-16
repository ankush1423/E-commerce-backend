import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema({
     user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     },
     product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
     },
     comment : {
        type : String,
        required : true
     },
     rating : {
        type : Number ,
        required : true,
        min : 0,
        max : 5
     }
},{timestamps : true})

export const Review = mongoose.model("Review",ReviewSchema)