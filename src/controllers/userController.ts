import { Request, Response } from "express";
import UserService from "../services/userService";

const userService = new UserService();

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
            const { password, ...userWithoutPassword } = user;
            response.status(200).json(userWithoutPassword);
        }
    }

    /*async createUser(request: Request, response: Response)
    {
        let newUser = request.body;
        newUser = await userService.createUser(newUser);
        const { password, ...newUserWithoutPassword } = newUser;
        response.status(201).json(newUserWithoutPassword);
    }*/

    async updateUser(request: Request, response: Response)
    {
        const userId = request.params.id;
        const updatedUser = request.body;
        const user = await userService.updateUser(userId, updatedUser);
        if(!user) response.status(404).send('User not found')
        else
        {
            const { password, ...userWithoutPassword } = user;
            response.status(200).json(userWithoutPassword);
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
}