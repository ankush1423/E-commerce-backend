import mongoose from "mongoose"

const CartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            quantity : {
                type : Number,
                required : true,
                default : 1
            }
        }
    ]
},{timestamps : true})



export const Cart = mongoose.model("Cart",CartSchema)