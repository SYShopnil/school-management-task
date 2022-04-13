import mongoose from "mongoose"
import CourseInterface from "../interfaces/model/course"

const Schema = mongoose.Schema;

const courseSchema = new Schema <CourseInterface>({
    courseId: {
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    slug:{
        type: String,
        unique: true
    },
    enrolledStudent : [
        {
            type: Schema.Types.ObjectId,
            ref: "Users" 
        }
    ],
    quizzes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Quizzes"
        }
    ],
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
},{
    timestamps: true
})


//export part
export default   mongoose.model <CourseInterface>("Courses", courseSchema)
