import express, { Router }  from "express"

const app = express
const route: Router = app.Router();
import {
    showAllStudentInfoController,
    deleteStudentBySlugController
} from "./controller"

route.get ("/get/all", showAllStudentInfoController)

route.put ("/delete/:slug", deleteStudentBySlugController)

export default route