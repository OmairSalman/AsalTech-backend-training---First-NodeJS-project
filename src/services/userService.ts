import { Request, Response } from 'express';
import FileSystem, { read } from 'fs';
import { User } from '../types/user';

export default class UserService
{
    readUsers(): User[]
    {
        let data: User[] = [];
        try
        {
            data = JSON.parse(FileSystem.readFileSync('src/data/users.json', 'utf8'));
            return data;
        }
        catch(error)
        {
            const errorDate = new Date();
            const errorDateString = errorDate.toLocaleDateString();
            const errorTimeString = errorDate.toLocaleTimeString();
            console.log(`[${errorDateString} @ ${errorTimeString}] Error fetching users data from file: `, error);
            return [];
        }
    }

    writeUsers(users: User[])
    {
        try
        {
            FileSystem.writeFileSync('src/data/users.json', JSON.stringify(users));
        }
        catch(error)
        {
            const errorDate = new Date();
            const errorDateString = errorDate.toLocaleDateString();
            const errorTimeString = errorDate.toLocaleTimeString();
            console.log(`[${errorDateString} @ ${errorTimeString}] Error saving users data to file: `, error);
        }
    }

    getUserById = (userId: number): User | null =>
    {
        const users = this.readUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return null;
        else return user;
    }

    createUser(newUser: User): User | null
    {
        const users = this.readUsers();
        if(!users) return null;
        newUser.id = users.length + 1;
        users.push(newUser);
        this.writeUsers(users);
        return newUser;
}

    updateUser = (userId: number, updatedUser: User): User | null =>
    {
        const users = this.readUsers();
        if(!users) return null;
        let user = users.find(u => u.id === userId);
        if (!user)
        {
            return null;
        }
        user = { ...user, ...updatedUser };
        users[userId] = user;
        this.writeUsers(users);
        return user;
    }

    deleteUser(userId: number): User | null
    {
        const users = this.readUsers();
        const user = users.find(u => u.id === userId);
        if (!user)
        {
            return null;
        }
        const updatedUsers = users.filter(u => u.id !== userId);
        this.writeUsers(updatedUsers);
        return user;
    }

    searchUsers(searchTerm: string): User[]
    {
        const users = this.readUsers();
        const filteredUsers = users.filter(u =>
            (u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.email.toLowerCase().includes(searchTerm.toLowerCase())));
        return filteredUsers;
    }
}