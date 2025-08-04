import { Request, Response } from "express";
import UserService from "../services/userService";
import AuthService from "../services/authService";

const userService = new UserService();
const authService = new AuthService();

export default class AuthController
{
    login(request: Request, response: Response)
    {
        response.render('login');
    }

    async loginUser(request: Request, response: Response)
    {
        const credentials: {email: string, password: string} = request.body;
        if (!credentials || !credentials.email || !credentials.password)
        {
            response.status(400).send('Please enter all login credentials');
            return;
        }
        const user = await authService.loginUser(credentials);
        if(!user) response.status(401).json({ "message": "Invalid email or password" });
        else
        {
            const { password, ...userWithoutPassword } = user;
            response.render('profile', {user: userWithoutPassword});
        }
    }

    register(request: Request, response: Response)
    {
        response.render('register');
    }

    async registerUser(request: Request, response: Response)
    {
        let newUser = request.body;
        if (!newUser || !newUser.name || !newUser.email || !newUser.password)
        {
            response.status(400).send('Invalid or incomplete user data');
            return;
        }
        if (newUser.password.length < 6)
        {
            response.status(400).send('Password must be at least 6 characters long');
            return;
        }
        newUser = await userService.createUser(newUser);
        const { password, ...newUserWithoutPassword } = newUser;
        response.render('profile', {user: newUserWithoutPassword});
    }
}