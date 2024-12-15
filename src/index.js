import { app } from "./app.js";
import { connectDB } from "./db/connetDB.js";

const port = process.env.PORT || 8080


// CONNECTION TO DATABASE AND STARTING A PORT
connectDB()
.then(() => {
     console.log("DATABASE IS CONNECTED SUCCESFULLY")
     app.listen(port , () => console.log("SERVER IS LISTEN AT PORT ",port))
})
.catch((err) => {
    console.log("ERROR WHILE CONNECTING TO THE DATABASE !!!!",err)
})
