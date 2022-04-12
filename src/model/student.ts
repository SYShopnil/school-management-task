import mongoose from "mongoose"
import studentInterface from "../interfaces/model/student"

const Schema = mongoose.Schema;

const studentSchema = new Schema <studentInterface> ({
    fatherName: String,
    motherName: String,
    enrolledCourse : [
        {
            type: Schema.Types.ObjectId,
            ref: "Courses"
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    } 
},{
    timestamps: true
})


//export part
export default  mongoose.model <studentInterface>("Students", studentSchema)
