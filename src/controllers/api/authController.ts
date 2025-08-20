import { Request, Response } from "express";
import { Types } from "mongoose";
import UserService from "../../services/userService";
import AuthService from "../../services/authService";

const userService = new UserService();
const authService = new AuthService();

export default class AuthController
{
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
            request.session.user =
            {
                id: user._id as Types.ObjectId,
                name: user.name,
                email: user.email
            };
            response.redirect('/feed?page=1');
        }
    }

    async registerUser(request: Request, response: Response)
    {
        let newUser = request.body;
        newUser = await authService.registerUser(newUser);
        const { password, ...newUserWithoutPassword } = newUser;
        request.session.user =
        {
            id: newUser._id as Types.ObjectId,
            name: newUser.name,
            email: newUser.email
        };
        response.render('profile', {user: newUserWithoutPassword});
    }

    async logoutUser(request: Request, response: Response)
    {
        request.session.destroy(err => {
            if (err) console.error(err);
            response.clearCookie('connect.sid');
            response.redirect('/');
        });
    }

    async showProfileById(request: Request, response: Response)
    {
        const userId = request.params.id;
        const user = await userService.getUserById(userId);
        if(user)
        {
            const { password, ...newUserWithoutPassword } = user;
            response.render('profile', {user: newUserWithoutPassword});
        }
    }
}