import express from "express"
import {authUser} from "../middlewares/auth.middleware.js"
import {
       getCart,
       createCart,
       addItemtoCart,
       removeItemCart,
       deleteCart
        } from "../controllers/cart.controller.js"

const router = express.Router()

router.use(authUser)

router.route("/:cartId").get(getCart).delete(deleteCart)

router.route("/").post(createCart)

router.route("/u/:cartId/:productId").patch(addItemtoCart)

router.route("/r/:cartId/:productId").patch(removeItemCart)


export default router;