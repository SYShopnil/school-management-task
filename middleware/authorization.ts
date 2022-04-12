import {
    Express,
    NextFunction,
    Request,
    Response
} from "express"
import UserInterface from "../src/interfaces/model/user"

const authorizationMiddleware: () => void = (...acceptedUserType: string[]) => async (req:Request, res:Response, next:NextFunction): Promise <void> => {
    try {
        const acceptedUser:string[] = acceptedUserType //store it as a array those who can access this api
        const requestUser:UserInterface = req.user //get this from authentication middleware
        const {userType} = requestUser //get the user type from the user
        const isAuthorizedUser:string | null | undefined = acceptedUser.find(user => user == userType) //check that is this user type is available or not user
        if(isAuthorizedUser) {
            next()
        }else {
            res.json({
                message: 'Restricted Route',
                status: 404
            })
        }
    }catch (err) {
        console.log(err);
        res.json({
            message: "Restricted Route",
            err,
            status: 404
        })
    }
}

export default authorizationMiddleware