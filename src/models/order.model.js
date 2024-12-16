import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({
     user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     },
     products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Products",
            quantity : {
                type : Number,
                required : true,
                default : 1
            }
        }
     ],
     totalPrice : {
        type : Number,
        required : true,
     },
     status : {
        type : String,
        enum : ["PENDING","DELIVERED","CANCELED"],
        default : "PENDING"
     },
},{timestamps : true})

export const Order = mongoose.model("Order",OrderSchema)