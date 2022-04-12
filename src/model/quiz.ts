
import mongoose from "mongoose"
import quizInterface from "../interfaces/model/quiz"

const Schema = mongoose.Schema;

const quizSchema = new Schema <quizInterface>({
    quizId: {
        type: String,
        required: true,
    },
    slug:{
        type: String,
        unique: true
    },
    courseId:{
        type: Schema.Types.ObjectId,
        ref: "Courses"
    },
    questions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Questions"
        }
    ],
    totalTime: {
        type: String,
        default: ""
    },
    totalQuestion: {
        type: Number,
        default: 0
    },
    totalMarks: {
        type: String,
        default: ""
    },
    results: [
        {
            type: Schema.Types.ObjectId,
            ref: "Results"
        }
    ]
},{
    timestamps: true
})


//export part
export default  mongoose.model <quizInterface>("Quizzes", quizSchema)
