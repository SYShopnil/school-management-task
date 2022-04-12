import express, { Router }  from "express"

const app = express
const route: Router = app.Router();
import {
    showAllTeacherController,
    deleteTeacherBySlugController,
    registerNewTeacherController
} from "./controller"

route.get ("/get/all", showAllTeacherController)

route.put ("/delete/:slug", deleteTeacherBySlugController)

route.post ("/registration", registerNewTeacherController)

export default route