import {ApiResponse} from "../utils/ApiResponse.js"

const notFound = (req,res) => {
     return res
            .status(404)
            .json(
                new ApiResponse(
                    {},
                    "404 error not found"
                )
            )
}

export {notFound}