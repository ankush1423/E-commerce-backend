import express from "express"
import {
         getAllProducts,
         getProduct,
         createProduct,
         updateProduct,
         deleteProduct
       }  from "../controllers/product.controller.js"

const router = express.Router()

router.route("/").get(getAllProducts).post(createProduct)

router.route("/:productId").get(getProduct).patch(updateProduct).delete(deleteProduct)

export default router;