import UserInterface from "../src/interfaces/model/user"
import TokeInterface from "../src/interfaces/utils/tokenData"
import jwt, { JwtPayload } from "jsonwebtoken"
require('dotenv').config()
import {Request, Response, NextFunction, Express } from "express"
import User from "../src/model/user"


const authenticationMiddleware = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        // const token = req.header('Authorization') //get the token from headers
        const {auth:token} = req.cookies //get the token from headers
        //get the dot env file data
        const securityCode:string = process.env.JWT_CODE  || "sssfjsdlfjsdl;kjfls;dkjfl;sdkjfl;sdkjf"//ge the security code from dot env
        if(!token) {
            res.json ({
                message: "Unauthorized user"
            })
        }else {
            const isValidToken:any | TokeInterface = await jwt.verify(token, securityCode) //check that is it a valid token or not
            if(isValidToken) {
                const {userId, userType, slug } = isValidToken //store the token data as a verified userType
                const user:UserInterface | null = await User.findOne ({
                    userId,
                    userType,
                    isActive: true,
                    slug
                }) // find the user
                if (user) { //if it is a valid user then it will execute
                    req.user = user;
                    req.isAuth = true
                    next ();
                }else {
                    req.isAuth = false
                    res.json ({
                        message: "Unauthorized user",
                        status: 406
                    })
                }
                
            }else {
                res.json ({
                    message: "Unauthorized user",
                    status: 406
                })
            }
        }
    }catch(err) {
        console.log(err);
        res.json ({
            message: "Unauthorized user",
            status: 406
        })
    }
}

export default authenticationMiddleware