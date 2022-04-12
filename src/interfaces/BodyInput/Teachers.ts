import ImageInterface from "../utils/image"
interface RegisterTeacher {
    firstName:string,
    lastName: string,
    password: string,
    retypePassword: string,
    dateOfBirth: string,
    profileImage: ImageInterface,
    dept: string,
    sex: string,
    salary: string,
    department: string,
    contactNumber: string,
    email: string
}

export default RegisterTeacher