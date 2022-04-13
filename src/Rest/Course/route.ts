import express, { Router }  from "express"
import auth from "../../../middleware/auth"
import authorization from "../../../middleware/authorization"

const app = express
const route: Router = app.Router();
import {
    createNewCourseController,
    createNewMcqQuestionController,
    enrollNewCourseController,
    generateQuizResultController
} from "./controller"

route.post ("/create", auth, authorization ("teacher")  ,createNewCourseController)
route.post ("/create/quiz", auth, authorization ("teacher")  ,createNewMcqQuestionController)
route.post ("/enrolled/course", auth, authorization ("student")  ,enrollNewCourseController)
route.post ("/submit/quiz", auth, authorization ("student", "teacher")  ,generateQuizResultController)


export default route