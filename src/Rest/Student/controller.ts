import e, {
    Request,
    Response
} from "express"

//models
import User from "../../model/user"

//interfaces
import UserInterface from "../../../src/interfaces/model/user"
import {
    UpdateReturn
} from "../../interfaces/utils/mongoDb"

//show all student
const showAllStudentInfoController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    try {
        const findAllStudent: UserInterface [] = await User.find ({
            userType: "student",
            isActive: true,
            isDeleted: false
        })
        .populate (
            {
                path: "studentProfile",
                select: "-_id -user",
                populate: {
                    path: "enrolledCourse",
                    select: "-_id"
                }
            }
        )
        if (findAllStudent.length != 0) { //if all student found 
            res.json ({
                message: "Student found",
                status: 202,
                data: findAllStudent
            })
        }else {
            res.json ({
                message: "Student not found",
                status: 404,
                data: null
            })
        }
    }catch (err) {
        console.log(err)
        res.json ({
            message: err,
            status: 406,
            data: null
        })
    }
}

//delete a student by slug
const deleteStudentBySlugController: (req:Request, res:Response) => void = async (req, res) => {
    try {
        const {slug:studentSlug} = req.params //get the slug of a user
        const findUser: UserInterface | null = await User.findOne ( //find the user from database
            {
                slug: studentSlug,
                isDeleted: false,
                isActive: true,
                userType: "student"
            }
        )
        if (findUser) { //if user found
            const deleteUser:UpdateReturn = await User.updateOne (
                {
                    slug: studentSlug,
                    isDeleted: false,
                    isActive: true ,
                    userType: "student"
                },
                {
                    $set: {
                        isDeleted: true,
                        isActive: false 
                    }
                },
                {multi: true}
            )
            if (deleteUser.modifiedCount != 0) {
                res.json ({
                    message: "Student successfully deleted",
                    status: 202
                })
            }else {
                res.json ({
                    message: "Student Delete failed",
                    status: 406
                })
            }
        }else {
            res.json ({
                message: "Student Not Found",
                status: 404
            })
        }
        
    }catch (err) {
        console.log(err)
        res.json ({
            message: err,
            status: 406
        })
    }
} 


export {
    showAllStudentInfoController,
    deleteStudentBySlugController
}
