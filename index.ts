import express, {Application, Request, Response} from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import studentRoute from "./src/Rest/Student/route"
import teacherRoute from "./src/Rest/Teacher/route"
import userRoute from "./src/Rest/User/route"

const app:Application = express();

const cookieParser = require('cookie-parser')
const cors = require ("cors");
dotenv.config ();


//env file
const url:string = process.env.SERVER_URL || "8080"
const mongoUrl:string = process.env.MONGO_URL || "mongodb://localhost:27017/SchoolManagement"

//parser and others middleware part
app.use (express.json({limit: "250mb"}))
app.use (express.urlencoded({extended: true, limit: "250mb"}))
app.use (express.static("public"))
app.use(cookieParser())
app.use (cors())

mongoose.connect (mongoUrl)
.then (() => console.log(`Server is connected to the database`))
.catch (err => console.log(err))



//create a server instance
app.listen (url, () => console.log(`Server is running on ${url}`))



//all rest api
app.use("/student", studentRoute)
app.use("/teacher", teacherRoute)
app.use("/user", userRoute)


//base route
app.get ("/", (req:Request, res:Response) => {
    res.send (`I am from root`)
})

//page not found route
app.get ("*", (req, res) => {
    res.send (`404 Page not found`)
})