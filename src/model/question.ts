
import mongoose from "mongoose"
import questionInterface from "../interfaces/model/question"

const Schema = mongoose.Schema;

const questionSchema = new Schema <questionInterface>({
    questionId: {
        type: String,
        required: true,
    },
    slug:{
        type: String,
        unique: true
    },
    quiz:{
        type: Schema.Types.ObjectId,
        ref: "Quizzes"
    },
    question: {
        type: String,
        required: true
    },
    mark: {
        type: Number,
        default: 1
    },
    correctOption: {
        type: String,
        required: true
    },
    options : [
        {
            no: String,
            option: String,
        }
    ]
},{
    timestamps: true
})


//export part
export default  mongoose.model <questionInterface>("Questions", questionSchema)
