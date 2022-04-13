import express, { Router }  from "express"

const app = express
const route: Router = app.Router();
import {
    showAllTeacherController,
    deleteTeacherBySlugController,
    registerNewTeacherController
} from "./controller"

//middleware
import auth from "../../../middleware/auth"
import authorization from "../../../middleware/authorization"

route.get ("/get/all" , auth, authorization ("admin"), showAllTeacherController)

route.put ("/delete/:slug", auth, authorization ("admin"), deleteTeacherBySlugController)

route.post ("/registration", registerNewTeacherController)

export default route