import mongoose from "mongoose"
import Student from "./student"
import Teacher from "./teacher"
import Admin from "./admin"

interface Contact {
    permanentAddress: string,
    currentAddress: string,
    mobileNo:string
}
interface User {
    _id: any | undefined,
    slug: string,
    userId: string,
    userType: string,
    password: string,
    firstName: string,
    lastName: string,
    email : string,
    dateOfBirth: any | object,
    sex:string,
    contact: Contact,
    profileImage : string,
    otp: string,
    isActive: boolean,
    isDeleted: boolean,
    adminProfile: Admin,
    studentProfile: Student,
    teacherProfile: Teacher
}

export default User
