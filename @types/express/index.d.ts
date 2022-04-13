import UserInterface from "../../src/interfaces/model/user";

declare global{
    namespace Express {
        interface Request {
            user: UserInterface //add a new user interface in the request interface,
            isAuth: boolean
        }
    }
}