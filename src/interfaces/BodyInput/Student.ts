import ImageInterface from "../utils/image"
interface RegisterStudent {
    firstName:string,
    lastName: string,
    password: string,
    retypePassword: string,
    dateOfBirth: string,
    profileImage: ImageInterface,
    sex: string,
    department: string,
    contactNumber: string,
    email: string,
    permanentAddress: string,
    currentAddress: string,
    motherName: string,
    fatherName: string
}

export default RegisterStudent