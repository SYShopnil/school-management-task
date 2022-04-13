import e, {
    Request,
    Response
} from "express"

//models
import User from "../../model/user"
import Admin from "../../model/admin"
import Teacher from "../../model/teacher"
import Student from "../../model/student"

//interfaces
import UserInterface from "../../../src/interfaces/model/user"
import TokenData from "../../../src/interfaces/utils/tokenData"
import {
    UpdateReturn
} from "../../interfaces/utils//mongoDb"
import {
    LoginInput
} from "../../interfaces/BodyInput/User"
import {
    TokenReturnInterface
} from "../../../src/interfaces/utils/jwtTokenGenerator"
import ForgotPasswordTokenData from "../../../src/interfaces/utils/forgotPasswordTokenData" 
import {
    UpdateUserInput
} from "../../interfaces/BodyInput/User"

//others 
import bcrypt from "bcrypt"
import jwtTokenGenerator from "../../../utils/jwtTokenGenerator"
import getCookieOption from  "../../../utils/cookiesOption"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import otpGenerator from "../../../utils/otpGenerator"
import sendMailer from "../../../utils/sentEmail"
import jwtVerifier from "../../../utils/jwtVerify"

dotenv.config ();
const LoggedInSession:string = `${process.env.LOOGGED_IN_USER_SESSON}d` || "5d" //by default 5 day will be the time limit of a active session
const CookieTimeLimit: string = (process.env.LOGGED_IN_USER_SESSON) || "5"
const JWT_CODE:string = process.env.JWT_CODE || "safjlskdjflskdjfl;ksdjflksdjf;lskdjf;lsdfsdf"
type forgotPasswordPartOneBody = {
    email: string
}

//login a existing user
const userLoginController: (req:Request, res:Response) => Promise <void> = async (req, res) => {
    try {
        const {
            email,
            password
        }:LoginInput = req.body

        //check that is it a valid user or not
        const checkValidUser: UserInterface | null  = await User.findOne ({
            email
        })
        if (checkValidUser) { //if user found then it will happen
            const {
                password:databasePassword
            } = checkValidUser
            const checkPassword:boolean = await bcrypt.compare (password, databasePassword)
            if (checkPassword) { //if password matched
                const loggedInUser:UserInterface = checkValidUser //store the logged in user 
                const tokenData: TokenData = {
                    userId: loggedInUser.userId,
                    userType: loggedInUser.userType,
                    slug:loggedInUser.slug
                }
                const {
                    isCreate,
                    token
                }:TokenReturnInterface = await jwtTokenGenerator (tokenData, LoggedInSession)
                if (isCreate) { //if token created then it will happen
                    const dataToken:string = token;
                    const cookieOption = getCookieOption (+CookieTimeLimit);
                    res.cookie ("auth",dataToken, cookieOption).json ({
                        message: "Logged in successfully",
                        user: loggedInUser,
                        status: 202
                    })
                    
                }else {
                    res.json ({
                        message: "Token creation failed",
                        status: 406,
                        user: null
                    })
                }

            }else {
                res.json ({
                    message: "Password Doesn't Matched",
                    status: 406,
                    user: null
                })
            }
        }else {
            res.json ({
                message: "User not found",
                status: 406,
                user: null
            })
        }
    }catch (err) {
        console.log(err)
        res.json ({
            message: err,
            status: 406,
            user:null
        })
    }
} 

//forgot password part 1 give the otp with token 
const forgotPasswordPartOneController:  (req:Request, res:Response) => Promise <void> = async (req, res) => {
    try {
        const {verifyToken:verifyToken}:{verifyToken:string} = req.cookies
        let email:string //which email we want to sent the otp
        if (!verifyToken) { //if token is not available in the cookies 
            const {
                email:bodyEmail
            }:forgotPasswordPartOneBody= req.body
            email = bodyEmail
        }else {
            const {email:tokeEmail}:any = jwt.verify (verifyToken, JWT_CODE)
            email = tokeEmail
        }
        const findReqUser:UserInterface | null= await User.findOne ({email}).select ("userType") //get the user 
        // console.log(email);
        if (findReqUser) { //if user hs found then it will happen
            const tokenData: ForgotPasswordTokenData = {
                userType: findReqUser?.userType,
                email
            }
            let number:string = ""
            const newOTP:string = otpGenerator (4) //generate 4 digit otp
            const findUser: UserInterface | null = await User.findOne ( //find the admin
                    {
                        email: email,
                        isDelete: false
                    }
                ).select (
                    `
                        slug
                        userId
                        email
                    `
                )
                if (findUser) { //if admin found 
                    const {slug, userId} = findUser
                    tokenData.slug = slug
                    tokenData.userId = userId
                    // console.log(findAdmin.personalInfo.contactNumber);
                    const updateOtp: UpdateReturn = await User.updateOne (
                        {
                            slug,
                            userId
                        },
                        {
                            $set: {
                                otp: newOTP
                            }
                        }
                    )       
                    if (updateOtp.modifiedCount != 0 ) {
                        console.log(`first`)
                        const {
                           message,
                           responseStatus 
                        } = await sendMailer ("",email, newOTP, "Verify", "User" )
                        if (responseStatus) {
                            const{
                                token,
                                isCreate
                            }: {
                                token:string,
                                isCreate: boolean,
                            } = await jwtTokenGenerator ({
                                slug,
                                userId,
                                email
                            }, "5d")
                            const cookieOption = getCookieOption (.05)
                            res.cookie("verifyToken", token, cookieOption).json ({
                                message: "A OTP has been sent to the user email"
                            })
                        }else {
                             res.json ({
                                message: "OTP not save"
                            })
                        }
                       
                    }
                }else {
                    res.json ({
                        message: "User not found"
                    })
                }
        }
        
    }catch (err) {
        console.log(err);
        res.json({
            message: err
        })
    }
}

//forgot password part 2 take the otp and verify it 
const verifyTheForgotPasswordOTPController:(req:Request, res:Response) => Promise <void>  = async (req, res) => {
    try {
        const {otp:inputOTP}: {otp:string} = req.body //get the input otp
        if (inputOTP.length == 4) { //if otp found then it will happen
            const {verifyToken} = req.cookies
            const {email, slug, userType}:any = await jwt.verify (verifyToken, JWT_CODE)
            // const {isMatch} = await  OTPVerification (email, slug, userType, inputOTP)
            const checkOtp:null | UserInterface = await User.findOne (
                {
                    email,
                    slug,
                    otp:inputOTP
                }
            )
            let isMatch:boolean = false;
            if (checkOtp) {
                isMatch = true
            }else {
                isMatch = false
            }
            if (isMatch) { //if otp match with database otp then it will happen
                res.status(202).json ({
                    message: "OTP successful verified",
                    isVerified: true
                })
            }else {
                res.json ({
                    message: "OTP not verified please put a valid one",
                    isVerified: false
                })
            }
            
        }else {
            res.json ({
                message: "OTP required or not valid",
                isVerified: false
            })
        }
    }catch (err) {
        res.json ({
            message: err,
            isVerified: false
        })
    }
}
//forgot password part 3 after verify the otp it will take the new password and update it.
const resetPasswordController:(req:Request, res:Response) => Promise <void>  = async (req, res) => {
    try {
        const {newPassword}: {newPassword:string} = req.body //get the data from body
        const {verifyToken} = req.cookies //get the token from cookies
        console.log(verifyToken)
        const {isVerify:{email, slug, userId, userType}}: {
            isVerify:any
        } = await jwtVerifier (verifyToken)
        const hashedPassword = await bcrypt.hash (newPassword, 10)
        if (hashedPassword) { //if password is hashed then it will happen
            let isPasswordChange = false //it will track that is password have changed or not
            const updateUser:UpdateReturn = await User.updateOne ( //update the admin data and update the password
                    {
                        email,
                        slug,
                        userId
                    },
                    {
                        $set: {
                            password: hashedPassword,
                            otp: ""
                        }
                    },
                    {
                        multi: true
                    }
                )
                // console.log(updateUser)
                if (updateUser.modifiedCount != 0 ) { //if admin is modified then it will happen
                    isPasswordChange = true
                }else {
                    isPasswordChange = false
                }
                // console.log(isPasswordChange)
            if (isPasswordChange) { //if the password is change then it will sent a positive response
                res.clearCookie ("verifyToken").status(202).json ({
                    message: "Password has changed successfully"
                })
            }else {
                res.json ({
                    message: "Password change failed"
                })
            }
        }else {
            res.json ({
                message: "Password hashing problem"
            })
        }
    }catch (err) {
        console.log(err);
        res.json ({
            message: err
        })
    }
}   

//update logged in user password 
const updateLoggedInUserPassword:(req:Request, res:Response) => Promise <void>  = async (req, res) => {
    try {
        const {
            newPassword:password,
            currentPassword:oldPassword
        }: {
            newPassword:string,
            currentPassword: string
        } = req.body
        const {
            password:currentLoggedInUsePassword
        }:UserInterface = req.user
        const isMatch:boolean = await bcrypt.compare (oldPassword, currentLoggedInUsePassword) 
        if (isMatch) {
             const hashedPassword = await bcrypt.hash (password, 10) //hashed the password 
            if (hashedPassword) { //if password hashed successfully
                const {slug, userType}:UserInterface = req.user
                let isUpdate:boolean = false
                const updatePassword:UpdateReturn = await User.updateOne (
                        {
                            slug,
                            userType,
                            "isDelete": false
                        },
                        {
                            $set: {
                                password: hashedPassword
                            }
                        }
                ) //update the logged in admin's password
                if (updatePassword.modifiedCount != 0) {
                    isUpdate = true
                }
                if (isUpdate) {
                    res.status (202).json ({
                        message: "Password updated successfully"
                    })
                }else {
                    res.json ({
                        message: "Password update failed"
                    })
                }
            }else {
                res.json ({
                    message: "Password hashing problem"
                })
            }
        }else {
            res.status (202).json ({
                message: "Current Password is wrong!!!"
            })
        }
    }catch (err) {
        console.log(err);
        res.json ({
            message: err,
        })
    }
}

//all user can update own profile 
const updateOwnProfileController :(req:Request, res:Response) => Promise <void>  = async (req, res) => {
    try {
        const {
            _id,
            userType,
            slug,
            userId
        }:UserInterface = req.user; //get the logged in use data
        const {
            common,
            profile
        }:UpdateUserInput = req.body
        let isChange:boolean = false;
        if (userType == "admin") { // when it is a admin
            const updateUser:UpdateReturn = await User.updateOne (
                {   
                    userId,
                    slug,
                    userType,
                    isDeleted: false
                },
                common,
                {
                    multi: true
                }
            ) 
            const updateProfile: UpdateReturn = await Admin.updateOne ({
                user: _id
            },
            profile,
            {
                multi: true
            })
            if (updateProfile.modifiedCount != 0 || updateUser.modifiedCount != 0) {
                isChange = true
            }

        }else if (userType == "teacher"){
            const updateUser:UpdateReturn = await User.updateOne (
                {   
                    userId,
                    slug,
                    userType,
                    isDeleted: false
                },
                common,
                {
                    multi: true
                }
                
            ) 
            const updateProfile: UpdateReturn = await Teacher.updateOne ({
                user: _id
            },
            profile,
            {
                multi: true
            })
            if (updateProfile.modifiedCount != 0 || updateUser.modifiedCount != 0) {
                isChange = true
            }
        }else if (userType == "student") {
            const updateUser:UpdateReturn = await User.updateOne (
                {   
                    userId,
                    slug,
                    userType,
                    isDeleted: false
                },
                common,
                {
                    multi: true
                }
            ) 
            const updateProfile: UpdateReturn = await Student.updateOne ({
                user: _id
            },
            profile,
            {
                multi: true
            })
            if (updateProfile.modifiedCount != 0 || updateUser.modifiedCount != 0) {
                isChange = true
            }
        }
        if (isChange) {
            res.json ({
                message: "Profile Successfully Updated"
            })
        }else {
            res.json ({
                message: "Profile  Update Failed"
            })
        }
    }catch (err) {
        console.log(err)
        res.json ({
            message: err
        })
    }
}

//logged in user can see his or her profile 
const showOwnProfileController :(req:Request, res:Response) => Promise <void>  = async (req, res) => {
    try {
        const {
            _id,
            userType,
            slug,
            userId
        }:UserInterface = req.user; //get the logged in use data 
        let returnUser: UserInterface | {} = {};
        if (userType == "admin") {
            const findAdmin:UserInterface | null = await User.findOne ({
                userType,
                userId,
                _id,
                slug,
                isDeleted: false,
                isActive:true
            }).populate (
                {
                    path: "adminProfile",
                    select: "-_id -user"
                }
            )
            if (findAdmin) {
                returnUser = findAdmin
            }else {
                returnUser = {}
            }
        }else if (userType == "teacher"){
            const findTeacher:UserInterface | null = await User.findOne ({
                userType,
                userId,
                _id,
                slug,
                isDeleted: false,
                isActive:true
            }).populate (
                {
                    path: "teacherProfile",
                    select: "-_id -user"
                }
            )
            if (findTeacher) {
                returnUser = findTeacher
            }else {
                returnUser = {}
            }
        }else if (userType == "student"){
            const findStudent:UserInterface | null = await User.findOne ({
                userType,
                userId,
                _id,
                slug,
                isDeleted: false,
                isActive:true
            }).populate (
                {
                    path: "studentProfile",
                    select: "-_id -user"
                }
            )
            if (findStudent) {
                returnUser = findStudent
            }else {
                returnUser = {}
            }
        }
        if (Object.values (returnUser).length != 0) { //if user profile found then it will happen
            res.json ({
                message: "Profile Found!!!",
                data: returnUser,
                status: 202
            })
        }else {
            res.json ({
                message: "Profile Not Found!!!",
                data: null,
                status: 404
            })
        }
    }catch (err) {
        res.json ({
            message: err,
            data: null,
            status: 406
        })
    }
}

export {
    userLoginController,
    forgotPasswordPartOneController,
    verifyTheForgotPasswordOTPController,
    resetPasswordController,
    updateLoggedInUserPassword,
    updateOwnProfileController,
    showOwnProfileController
}