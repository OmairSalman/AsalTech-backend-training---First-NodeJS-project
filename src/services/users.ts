import { Request, Response } from 'express';
import * as FileSystem from 'fs';
import { User } from '../types/user';

export const getUsers = (request: Request, response: Response) =>
{
    FileSystem.readFile('src/data/users.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            console.error('Error reading users file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }
        const users: User[] = JSON.parse(data);
        response.json(users);
    });
}

export const getUserById = (request: Request, response: Response) =>
{
    const userId = parseInt(request.params.id, 10);
    FileSystem.readFile('src/data/users.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            console.error('Error reading users file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }
        const users: User[] = JSON.parse(data);
        const user = users.find(u => u.id === userId);
        if (!user)
        {
            response.status(404).send('User not found');
            return;
        }
        response.json(user);
    });
}

export const createUser = (request: Request, response: Response) =>
{
    const newUser: User = request.body;
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
    FileSystem.readFile('src/data/users.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            console.error('Error reading users file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }
        const users: User[] = JSON.parse(data);
        newUser.id = users.length + 1;
        users.push(newUser);
        FileSystem.writeFile('src/data/users.json', JSON.stringify(users), (err) =>
        {
            if (err)
            {
                console.error('Error writing users file:', err);
                response.status(500).send('Internal Server Error');
                return;
            }
            response.status(201).json(newUser);
        });
    });
}

export const updateUser = (request: Request, response: Response) =>
{
    const userId = parseInt(request.params.id, 10);
    const updatedUser: User = request.body;
    FileSystem.readFile('src/data/users.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            console.error('Error reading users file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }
        const users: User[] = JSON.parse(data);
        let user = users.find(u => u.id === userId);
        if (!user)
        {
            response.status(404).send('User not found');
            return;
        }
        user = { ...user, ...updatedUser };
        users[userId] = user;
        FileSystem.writeFile('src/data/users.json', JSON.stringify(users), (err) =>
        {
            if (err)
            {
                console.error('Error writing users file:', err);
                response.status(500).send('Internal Server Error');
                return;
            }
            response.status(201).json(user);
        });
    });
}

export const deleteUser = (request: Request, response: Response) =>
{
    const userId = parseInt(request.params.id, 10);
    FileSystem.readFile('src/data/users.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            console.error('Error reading users file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }
        const users: User[] = JSON.parse(data);
        const user = users.find(u => u.id === userId);
        if (!user)
        {
            response.status(404).send('User not found');
            return;
        }
        const updatedUsers = users.filter(u => u.id !== userId);
        FileSystem.writeFile('src/data/users.json', JSON.stringify(updatedUsers), (err) =>
        {
            if (err)
            {
                console.error('Error writing users file:', err);
                response.status(500).send('Internal Server Error');
                return;
            }
            response.status(204).json(user);
        });
    });
}

export const loginUser = (request: Request, response: Response) =>
{
    const credentials: {email: string, password: string} = request.body;
    if (!credentials || !credentials.email || !credentials.password)
    {
        response.status(400).send('Please enter all login credentials');
        return;
    }
    FileSystem.readFile('src/data/users.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            console.error('Error reading users file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }
        const users: User[] = JSON.parse(data);
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (!user)
        {
            response.status(401).send('Invalid email or password');
            return;
        }
        response.json({ message: 'Login successful', user });
    });
}

export const searchUsers = (request: Request, response: Response) =>
{
    const query = request.query.query as string;
    if (!query)
    {
        response.status(400).send('Search query is required');
        return;
    }
    FileSystem.readFile('src/data/users.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            console.error('Error reading users file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }
        const users: User[] = JSON.parse(data);
        const filteredUsers = users.filter(u =>
            (u.name.toLowerCase().includes(query.toLowerCase())) ||
            (u.email.toLowerCase().includes(query.toLowerCase())));
        response.json(filteredUsers);
    });
}