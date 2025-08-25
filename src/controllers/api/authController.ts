import { Request, Response } from "express";
import { Types } from "mongoose";
import AuthService from "../../services/authService";
import jwt from 'jsonwebtoken';

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
        if(typeof user === 'string')
            if(user === 'DNE')
                response.status(401).json({ error: "Account doesn't exist, please register" });
            else
                response.status(401).json({ error: "Invalid email or password" });
        else
        {
            const payload = {
                id: user._id,
                name: user.name,
                email: user.email
            };

            
            const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
            
            response.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // only HTTPS in prod
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 // 1 hour
            });

            response.redirect('/feed?page=1');
        }
    }

    async registerUser(request: Request, response: Response)
    {
        let newUser = request.body;
        newUser = await authService.registerUser(newUser);
        
        const payload = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
        
        response.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only HTTPS in prod
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 // 1 hour
        });

        response.redirect('/feed?page=1');
    }

    async logoutUser(request: Request, response: Response)
    {
        response.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/", // must match the path used when setting the cookie
        });
        response.redirect('/');
    }
}