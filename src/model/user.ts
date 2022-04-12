import mongoose from "mongoose"
import UserInterface from "../../src/interfaces/model/user"

const Schema = mongoose.Schema;

const userSchema = new Schema <UserInterface>({
    slug:{
        type: String,
        unique: true
    },
    userId: {
        type: String,
        unique: true
    },
    userType:{
        type:String,
        trim: true,
        enum: ["admin", "teacher", "student"],
        required: true
    },
    password: String,
    firstName: {
        type:String,
        trim: true
    },
    lastName:{
        type:String,
        trim: true
    },
    email : {
        type: String,
        unique: true
    },
    dateOfBirth:{
        type: Date,
        trim: true
    },
    sex:{
        type:String,
        enum: ["male", "female", "others"]
    },
    contact:{
        permanentAddress: String,
        currentAddress: String,
        mobileNo:String,
    },
    profileImage : {
        type: String,
        default: ""
    },
    otp:{
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    adminProfile: {
        type: Schema.Types.ObjectId,
        ref: "Admins"
    },
    studentProfile: {
        type: Schema.Types.ObjectId,
        ref: "Students"
    },
    teacherProfile: {
        type: Schema.Types.ObjectId,
        ref: "Teachers"
    }
})

export default mongoose.model <UserInterface>("Users", userSchema)
