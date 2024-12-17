import express from "express"
import {authUser} from "../middlewares/auth.middleware.js"
import {
        getAllWhishList,
        createWhishList,
        addItemToWhishList,
        removeItemFromWhishlist,
        deleteWhishList
      }  from "../controllers/whishlist.controller.js"

const router = express.Router()

router.use(authUser)

router.route("/").get(getAllWhishList).post(createWhishList)

router.route("/u/:whishListId/:productId").patch(addItemToWhishList).patch(removeItemFromWhishlist)

router.route("/d/:whishListId").delete(deleteWhishList)

export default router;