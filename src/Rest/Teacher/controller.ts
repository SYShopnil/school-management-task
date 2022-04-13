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
import {
    uploadAnyImage,
    uploadProfilePictureDefault
} from "../../../utils/uploadPictureHandler"

//interfaces
import UserInterface from "../../../src/interfaces/model/user"
import TeacherRegistrationBodyInterface from "../../../src/interfaces/BodyInput/Teachers"
import TeacherProfileInterface from "../../../src/interfaces/model/teacher"
import {
    UpdateReturn
} from "../../interfaces/utils/mongoDb"


//others file 
import bcrypt from "bcrypt"

//show all teacher controller
const showAllTeacherController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    try {
        const findAllTeacher: UserInterface [] = await User.find ({
            userType: "teacher",
            isActive: true,
            isDeleted: false
        })
        .populate (
            {
                path: "teacherProfile",
                select: "-_id -user"
            }
        )
        if (findAllTeacher.length != 0) { //if all teacher found 
            res.json ({
                message: "Teachers found",
                status: 202,
                data: findAllTeacher
            })
        }else {
            res.json ({
                message: "Teachers not found",
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


//delete a teacher by slug 
const deleteTeacherBySlugController: (req:Request, res:Response) => void = async (req, res) => {
    try {
        const {slug:studentSlug} = req.params //get the slug of a user
        const findUser: UserInterface | null = await User.findOne ( //find the user from database
            {
                slug: studentSlug,
                isDeleted: false,
                isActive: true,
                userType: "teacher"
            }
        )
        if (findUser) { //if user found
            const deleteUser:UpdateReturn = await User.updateOne (
                {
                    slug: studentSlug,
                    isDeleted: false,
                    isActive: true ,
                    userType: "teacher"
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
                    message: "Teacher successfully deleted",
                    status: 202
                })
            }else {
                res.json ({
                    message: "Teacher Delete failed",
                    status: 406
                })
            }
        }else {
            res.json ({
                message: "Teacher Not Found",
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

//register a new teacher 
const registerNewTeacherController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            password,
            retypePassword,
            dept,
            profileImage: {
                base64:providedBase64,
                size:providedProfileImageSize
            },
            sex,
            salary,
            contactNumber,
            email
        }:TeacherRegistrationBodyInterface = req.body; //get all data from body
        // const createTeacherProfile:TeacherInterface = new Teacher ({ //create a new teacher profile
        //     salary,
        //     department
        // })
        //first create a new user interface 
        const teacherUserId = idGenerator ("TEA") //generate a teacher User id
        const teacherSlug = slugGenerator (teacherUserId, sex, dept) //generate a slug by using teacher id, gender and department
        let imageUrl:string = "";
        let isUpload:boolean = false
        const hashedPassword= await bcrypt.hash (password, 10)
        //profile picture upload part for teacher
        if (providedBase64) { //if teacher provide base64 then it will happen
            const {
                fileAddStatus,
                fileUrl
            } = await uploadAnyImage (providedBase64, teacherUserId) //it will upload profile image
            isUpload = fileAddStatus
            imageUrl = fileUrl
        }else {
            const {
                fileAddStatus,
                fileUrl
            } = await uploadProfilePictureDefault ("teacher", teacherUserId)
            isUpload = fileAddStatus
            imageUrl = fileUrl
        }
        if (isUpload) {
            const createNewUser = new User ({ //create the instance of a teacher
                slug:teacherSlug,
                userId: teacherUserId,
                userType: "teacher",
                password: hashedPassword,
                firstName,
                lastName,
                email,
                dateOfBirth,
                sex,
                contact: contactNumber,
                profileImage : imageUrl
            })
            const saveUser:UserInterface = await createNewUser.save() //save the user 
            if (Object.keys(saveUser).length != 0) { //if user create successfully then it will happen
                const newUser:UserInterface = saveUser; 
                const {
                    _id:newUserDatabaseId
                } = newUser
                const createTeacherProfile = new Teacher ({ //create a instance of a teacher
                    salary,
                    department:dept,
                    user: newUserDatabaseId
                })
                const saveNewTeacher: TeacherProfileInterface = await createTeacherProfile.save ();
                if (Object.keys(saveNewTeacher).length != 0) { //if teacher profile create successfully then
                    const {_id:newTeacherDataBaseId}:any = saveNewTeacher;
                    const updateUserSchema:UpdateReturn = await User.updateOne (
                        { 
                            _id: newUserDatabaseId,
                            isActive: true,
                            isDeleted: false
                        },
                        {
                            $set : {
                                teacherProfile: newTeacherDataBaseId
                            }
                        }
                    )
                    if (updateUserSchema.modifiedCount != 0) {
                        res.json ({
                            message: "Teacher Registration Done!!",
                            status: 201,
                        })
                    }else {
                       res.json ({
                            message: "Teacher Creation failed",
                            status: 406,
                        }) 
                    }

                }else {
                    res.json ({
                        message: "Teacher Creation failed",
                        status: 406,
                    })
                }
            }else {
                res.json ({
                    message: "Teacher Creation failed",
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
    showAllTeacherController,
    registerNewTeacherController,
    deleteTeacherBySlugController
}