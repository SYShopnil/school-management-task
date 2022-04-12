import User from "../model/user"
import Teacher from "../model/teacher"
import Student from "../model/student"
import Admin from "../model/admin"

interface LoginInput {
    email:string,
    password: string
}


interface UpdateUserInput {
    common: User,
    profile: Teacher | Student | Admin
}

export {
    LoginInput,
    UpdateUserInput
}