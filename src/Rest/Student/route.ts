import express, { Router }  from "express"

import auth from "../../../middleware/auth"
import authorization from "../../../middleware/authorization"

const app = express
const route: Router = app.Router();
import {
    showAllStudentInfoController,
    deleteStudentBySlugController,
    registerNewStudentController
} from "./controller"

route.get ("/get/all", auth, authorization ("admin"),  showAllStudentInfoController)

route.put ("/delete/:slug" , auth, authorization ("admin"), deleteStudentBySlugController)

route.post ("/register", registerNewStudentController)

export default route