import Student from  "./student"
import Quiz from  "./quiz"
import Teachers from  "./teacher"

interface Course {
    _id: any,
    courseId: string,
    slug: string,
    enrolledStudent : [Student],
    quizzes: [Quiz],
    instructor: Teachers,
    courseName: string,
    duration: string
}



//export part
export default Course;
