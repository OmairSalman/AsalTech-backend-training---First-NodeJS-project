import { Request, Response } from "express";
import UserService from "../../services/userService";
import PostService from "../../services/postService";
import jwt from 'jsonwebtoken';

const userService = new UserService();
const postService = new PostService();

export default class UserController
{
    async getUsers(request: Request, response: Response)
    {
        const users = await userService.readUsers();
        if(!users) response.status(404).send('Users data not found');
        response.status(200).json(users);
    }

    async getUserById(request: Request, response: Response)
    {
        const userId = request.params.id;
        const user = await userService.getUserById(userId);
        if(!user) response.status(404).send('User not found')
        else
        {
            response.status(200).json(user);
        }
    }

    async updateUser(request: Request, response: Response)
    {
        const userId = request.params.id;
        const updatedUser = request.body;

        if (updatedUser.newPassword || updatedUser.confirmPassword) {
            if (!updatedUser.newPassword || !updatedUser.confirmPassword) {
                return response.status(400).send('Both password fields are required.');
            }
            if (updatedUser.newPassword !== updatedUser.confirmPassword) {
                return response.status(400).send('Passwords do not match.');
            }
        }

        const user = await userService.updateUser(userId, updatedUser);
        if(typeof user === 'string')
            {
                if(request.xhr)
                    response.json({message: user});

                else response.status(400).json({message: user});
            }
        else
        {
            if(request.user?._id === user._id)
            {
                response.clearCookie("accessToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                });

                response.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                });

                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '30d' });

                response.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 15
                });

                response.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 60 * 24 * 30
                });
            }
            response.status(200).json({success: true, user: user});
        }
    }

    async deleteUser(request: Request, response: Response)
    {
        const userId = request.params.id;
        const deletedUser = await userService.deleteUser(userId);
        if (!deletedUser) response.status(404).send('User not found');
        else
        {
            const { password, ...deletedUserWithoutPassword } = deletedUser;
            response.status(200).json(deletedUserWithoutPassword);
        }
    }

    async searchUsers(request: Request, response: Response)
    {
        const searchTerm = request.query.search as string;
        if (!searchTerm) response.status(400).send('Search query is required');
        const filteredUsers = await userService.searchUsers(searchTerm);
        response.status(200).json(filteredUsers);
    }

    async renderUsers(request: Request, response: Response)
    {
        try
        {
            const users = await userService.readUsers();
            if(!users) response.status(404).send('Users data not found');
            response.render('users', {users});
        }
        catch(error)
        {
            const errorDate = new Date();
            const errorDateString = errorDate.toLocaleDateString();
            const errorTimeString = errorDate.toLocaleTimeString();
            console.error(`[${errorDateString} @ ${errorTimeString}] Error rendering users page: `, error);
        }
    }

    async getUserPosts(request: Request, response: Response)
    {
        let userId = request.params.userId;
        const page = parseInt(request.query.page as string) || 1;
        const posts = await postService.getPostsByUserId(userId, page, 10);
        if(!posts) return response.status(404).send("No posts by user");
        return response.status(200).send({message: `Found posts of user with id ${userId}`, posts: posts});
    }
}