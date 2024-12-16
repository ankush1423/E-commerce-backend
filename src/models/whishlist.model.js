import mongoose from "mongoose"

const WhishListSchema = new mongoose.Schema({
     user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     },
     products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        }
     ]
},{timestamps : true})


export const Whishlist = mongoose.model("Whishlist",WhishListSchema)