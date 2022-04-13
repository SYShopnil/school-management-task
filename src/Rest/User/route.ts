import express, { Router }  from "express"

const app = express
const route: Router = app.Router();
import {
    userLoginController,
    forgotPasswordPartOneController,
    verifyTheForgotPasswordOTPController,
    resetPasswordController,
    updateLoggedInUserPassword,
    updateOwnProfileController,
    showOwnProfileController
} from "./controller"
//middleware 
import auth from "../../../middleware/auth"
import authorize from "../../../middleware/authorization"

route.post ("/login", userLoginController) 
route.post ("/forgotPassword/verify/user", forgotPasswordPartOneController) 
route.post ("/forgotPassword/verify/otp", verifyTheForgotPasswordOTPController) 
route.post ("/forgotPassword/done", resetPasswordController) 
route.post ("/update/password", auth, authorize ("admin", "teacher", "student"), updateLoggedInUserPassword) 
route.put ("/update/profile", auth, authorize ("admin", "teacher", "student"), updateOwnProfileController) 
route.get ("/show/profile", auth, authorize ("admin", "teacher", "student"), showOwnProfileController) 

export default route