import mongoose from "mongoose"
import AdminInterface from "../interfaces/model/admin"

const Schema = mongoose.Schema ;

const adminSchema = new Schema <AdminInterface> ({
    academicInfo : [
        {
            degreeName: String,
            result: String,
            season: String,
            passingYears: String
        }
    ],
    officalInfo:{
        salary: {
            type:String
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    } 
},
{
    timestamps: true
})
//export part
export default  mongoose.model <AdminInterface>("Admins", adminSchema)

