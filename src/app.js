import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { notFound } from "./middlewares/notFound.middleware.js"

const app = express()

//SETTING THE MIDDLEWARES
app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials : true
    }
))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : false , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//ROUTES OF OUR API
import userRoutes from "./routes/user.route.js"
import reviewRoutes from "./routes/review.route.js"

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/reviews",reviewRoutes)


app.use(notFound)
export {app}