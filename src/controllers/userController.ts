import { Request, Response } from "express";
import { User } from "../types/user";
import UserService from "../services/userService";

const userService = new UserService();

export default class UserController
{
    getUsers(request: Request, response: Response)
    {
        const users = userService.readUsers();
        if(!users) response.status(404).send('Users data not found');
        response.status(200).json(users);
    }

    getUserById(request: Request, response: Response)
    {
        const userId = parseInt(request.params.id, 10);
        const user = userService.getUserById(userId);
        if(!user) response.status(404).send('User not found')
        else
        {
            const { password, ...userWithoutPassword } = user;
            response.status(200).json(userWithoutPassword);
        }
    }

    createUser(request: Request, response: Response)
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
        newUser = userService.createUser(newUser);
        const { password, ...newUserWithoutPassword } = newUser;
        response.status(201).json(newUserWithoutPassword);
    }

    updateUser(request: Request, response: Response)
    {
        const userId = parseInt(request.params.id, 10);
        const updatedUser: User = request.body;
        const user = userService.updateUser(userId, updatedUser);
        if(!user) response.status(404).send('User not found')
        else
        {
            const { password, ...userWithoutPassword } = user;
            response.status(200).json(userWithoutPassword);
        }
    }

    deleteUser(request: Request, response: Response)
    {
        const userId = parseInt(request.params.id, 10);
        const deletedUser = userService.deleteUser(userId);
        if (!deletedUser) response.status(404).send('User not found');
        else
        {
            const { password, ...deletedUserWithoutPassword } = deletedUser;
            response.status(200).json(deletedUserWithoutPassword);
        }
    }

    searchUsers(request: Request, response: Response)
    {
        const searchTerm = request.query.search as string;
        if (!searchTerm) response.status(400).send('Search query is required');
        const filteredUsers = userService.searchUsers(searchTerm);
        response.status(200).json(filteredUsers);
    }
}