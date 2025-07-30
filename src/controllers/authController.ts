import { Request, Response } from "express";
import { User } from "../types/user";
import UserService from "../services/userService";
import AuthService from "../services/authService";

const userService = new UserService();
const authService = new AuthService();

export default class AuthController
{
    loginUser(request: Request, response: Response)
    {
        const credentials: {email: string, password: string} = request.body;
        if (!credentials || !credentials.email || !credentials.password)
        {
            response.status(400).send('Please enter all login credentials');
            return;
        }
        const user = authService.loginUser(credentials);
        if(!user) response.status(401).json({ "message": "Invalid email or password" });
        else
        {
            const { password, ...userWithoutPassword } = user;
            response.status(200).json(userWithoutPassword);
        }
    }
}