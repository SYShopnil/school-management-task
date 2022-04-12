import mongoose from "mongoose"
import teacherInterface from "../interfaces/model/teacher"

const Schema = mongoose.Schema;

const teacherSchema = new Schema <teacherInterface>({
    salary: {
        type:String
    },
    department:{
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    } 
},{
    timestamps: true
})


//export part
export default mongoose.model <teacherInterface>("Teachers", teacherSchema)
