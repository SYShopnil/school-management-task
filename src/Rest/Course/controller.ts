import e, {
    Request,
    Response
} from "express"

//models
import User from "../../model/user"
import Teacher from "../../model/teacher"


//utils file 
import slugGenerator from "../../../utils/slugGenerator"
import idGenerator from "../../../utils/idGenerator"

//interfaces
import UserInterface from "../../../src/interfaces/model/user"
import TeacherProfileInterface from "../../../src/interfaces/model/teacher"
import {
    UpdateReturn
} from "../../interfaces/utils/mongoDb"

//create a new course 
const createNewCourseController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    
}

export {
    createNewCourseController
}

