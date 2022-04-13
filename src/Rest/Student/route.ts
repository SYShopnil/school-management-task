import express, { Router }  from "express"

const app = express
const route: Router = app.Router();
import {
    showAllStudentInfoController,
    deleteStudentBySlugController,
    registerNewStudentController
} from "./controller"

route.get ("/get/all", showAllStudentInfoController)

route.put ("/delete/:slug", deleteStudentBySlugController)

route.post ("/register", registerNewStudentController)

export default route