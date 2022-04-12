
import mongoose from "mongoose"
import resultInterface from "../interfaces/model/result"

const Schema = mongoose.Schema;

const resultSchema = new Schema <resultInterface>({
    resultId: {
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
    studentResponse : [
        {
            question: {
                type: Schema.Types.ObjectId,
                ref: "Questions"
            },
            response: String
        }
    ],
    mark: {
        type: Number,
        default: 0
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
},{
    timestamps: true
})


//export part
export default  mongoose.model <resultInterface>("Results", resultSchema)
