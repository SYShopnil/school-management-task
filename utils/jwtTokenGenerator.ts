const jwt = require ("jsonwebtoken")
import dotenv from "dotenv"

dotenv.config()

const securityCode:string = process.env.JWT_CODE || "sajflsdkjfslkdjfslkdfjsldkjfsld;kafjs;ldfjs;ldkfj"

//interface 
import {
    TokenReturnInterface
} from "../src/interfaces/utils/jwtTokenGenerator"

const tokenGenerator: (data:any, exp:string) => Promise <TokenReturnInterface> = async (data, exp) => {
    const expiresIn = exp || `${process.env.TOKEN_EXPIRE}d` //this will count in days
    const token:string =  jwt.sign  (data, securityCode, {expiresIn}) //generate a new code
    if (token) {
        return {
            token,
            isCreate: true
        }
    }else {
        return {
            token,
            isCreate: false
        }
    }
}

export default tokenGenerator