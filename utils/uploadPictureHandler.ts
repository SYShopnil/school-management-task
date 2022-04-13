const fs = require('fs');
const serverUrl:string = process.env.DATA_URL || `http://localhost:3030` //it will come from dot env file

//Interfaces 
import  {
    FileUploadDefault,
    FileUploadDefaultReturn
} from "../src/interfaces/utils/fileUpload"

//it will upload any base 64 file  in the server 
const uploadAnyImage: (base64:string, userId:string) => Promise <FileUploadDefaultReturn> = async (base64, userId) => {
    const myBase64Data:string = base64
    const dataExtension:string = "png"
    const fileName:string = `${userId}${+new Date()}.${dataExtension}`
    const saveDirectory:string = `${__dirname}/../public/${fileName}`
    const upload:Promise<FileUploadDefault> = new Promise (resolve => {
        fs.writeFile( saveDirectory , myBase64Data, {encoding: "base64"}, (err: any) => { //this will upload file into public folder
            if(err) {
                console.log(err);
                resolve ({
                    fileAddStatus : false, 
                    fileUrl : ""
                })
            }else{
                const dataUrl = `${serverUrl}/${fileName}`
                console.log("File added successfully");
                resolve ({
                    fileAddStatus : true, 
                    fileUrl : dataUrl
                })
            }
        }) //save the data into public folder
    })
    const {fileAddStatus, fileUrl} = await upload
    return {
        fileUrl,
        fileAddStatus
    }
}

const uploadProfilePictureDefault: (userType:string, userID:string) => Promise <FileUploadDefaultReturn> = async (userType, userID) => {
    let base64:string = "";
    if (userType.toLowerCase() == "teacher") {
        base64 = fs.readFileSync (`${__dirname}/../assert/teacherDefault.png`, "base64") //it will convert local default image to base64 format
    }else  if (userType.toLowerCase() == "student") {
        base64 = fs.readFileSync (`${__dirname}/../assert/studentDefault.png`, "base64") //it will convert local default image to base64 format
    }else  if (userType.toLowerCase() == "admin") {
        base64 = fs.readFileSync (`${__dirname}/../assert/studentDefault.png`, "base64") //it will convert local default image to base64 format
    }else {
        base64 = fs.readFileSync (`${__dirname}/../assert/userDefault.png`, "base64") //it will convert local default image to base64 format
    }
    if (base64) { //if base64 exist then it will execute
        const {fileAddStatus, fileUrl} = await  uploadAnyImage(base64, userID) //this will upload local server image into server
        return {
            fileAddStatus,
            fileUrl
        }
    }else {
        return {
            fileAddStatus: false,
            fileUrl: ""
        }
    }
}

export {
    uploadAnyImage,
    uploadProfilePictureDefault
}