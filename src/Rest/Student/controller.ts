import e, {
    Request,
    Response
} from "express"

//models
import User from "../../model/user"
import Student from "../../model/student"

//interfaces
import UserInterface from "../../../src/interfaces/model/user"
import StudentInterface from "../../../src/interfaces/model/student"
import {
    UpdateReturn
} from "../../interfaces/utils/mongoDb"
import StudentCreateBodyInput from  "../../interfaces/BodyInput/Student"


//utils file 
import slugGenerator from "../../../utils/slugGenerator"
import idGenerator from "../../../utils/idGenerator"
import {
    uploadAnyImage,
    uploadProfilePictureDefault
} from "../../../utils/uploadPictureHandler"

//others file 
import bcrypt from "bcrypt"


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


//register a new student 
const registerNewStudentController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            password,
            retypePassword,
            motherName,
            fatherName,
            profileImage: {
                base64:providedBase64,
                size:providedProfileImageSize
            },
            sex,
            contactNumber,
            email,
            permanentAddress,
            currentAddress
        }:StudentCreateBodyInput = req.body; //get all data from body
        //first create a new user interface 
        const studentId = idGenerator ("STD") //generate a student User id
        const studentSlug = slugGenerator (studentId, sex) //generate a slug by using student id, gender and department
        let imageUrl:string = "";
        let isUpload:boolean = false
        const hashedPassword= await bcrypt.hash (password, 10)
        //profile picture upload part for student
        if (providedBase64) { //if student provide base64 then it will happen
            const {
                fileAddStatus,
                fileUrl
            } = await uploadAnyImage (providedBase64, studentId) //it will upload profile image
            isUpload = fileAddStatus
            imageUrl = fileUrl
        }else {
            const {
                fileAddStatus,
                fileUrl
            } = await uploadProfilePictureDefault ("student", studentId)
            isUpload = fileAddStatus
            imageUrl = fileUrl
        }
        if (isUpload) {
            const createNewUser = new User ({ //create the instance of a student
                slug:studentSlug,
                userId: studentId,
                userType: "student",
                password: hashedPassword,
                firstName,
                lastName,
                email,
                dateOfBirth,
                sex,
                contact: {
                    permanentAddress,
                    currentAddress,
                    mobileNo: contactNumber
                },
                profileImage : imageUrl
            })
            const saveUser: UserInterface = await createNewUser.save() //save the user 
            if (Object.keys(saveUser).length != 0) { //if user create successfully then it will happen
                const newUser:UserInterface = saveUser; 
                const {
                    _id:newUserDatabaseId
                } = newUser
                const createTeacherProfile = new Student ({ //create a instance of a teacher
                    fatherName,
                    motherName,
                    user: newUserDatabaseId
                })
                const saveNewTeacher: StudentInterface = await createTeacherProfile.save ();
                if (Object.keys(saveNewTeacher).length != 0) { //if student profile create successfully then
                    const {_id:newTeacherDataBaseId}:any = saveNewTeacher;
                    const updateUserSchema:UpdateReturn = await User.updateOne (
                        { 
                            _id: newUserDatabaseId,
                            isActive: true,
                            isDeleted: false
                        },
                        {
                            $set : {
                                studentProfile: newTeacherDataBaseId
                            }
                        }
                    )
                    if (updateUserSchema.modifiedCount != 0) {
                        res.json ({
                            message: "Student Registration Done!!",
                            status: 201,
                        })
                    }else {
                       res.json ({
                            message: "Student Creation failed",
                            status: 406,
                        }) 
                    }

                }else {
                    res.json ({
                        message: "Student Creation failed",
                        status: 406,
                    })
                }
            }else {
                res.json ({
                    message: "Student Creation failed",
                    status: 406,
                })
            }   
        }else {
            res.json ({
                message: "Profile Upload failed",
                status: 406,
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
    deleteStudentBySlugController,
    registerNewStudentController
}


