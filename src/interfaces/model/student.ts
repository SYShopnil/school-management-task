import Course from "./course"
import User from "./user"

interface Student {
    fatherName: string,
    motherName: string,
    enrolledCourse : [Course] 
    user: User
}

//export part
export default Student
