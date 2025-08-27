import { User } from "../models/userEntity";
import crypto from 'crypto';

export default class UserService
{
    async readUsers(): Promise<User[]>
    {
        try
        {
            return await User.find();
        }
        catch(error)
        {
            const errorDate = new Date();
            const errorDateString = errorDate.toLocaleDateString();
            const errorTimeString = errorDate.toLocaleTimeString();
            console.error(`[${errorDateString} @ ${errorTimeString}] Error fetching users data from DB:\n`, error);
            return [];
        }
    }

    async getUserById(userId: string): Promise<User | null>
    {
        const user = await User.findOneBy({ _id: userId });
        if (!user) return null;
        else return user;
    }

    async updateUser(userId: string, updatedUser: User): Promise<User | null>
    {
        await User.update({ _id: userId }, updatedUser);
        const user = await User.findOneBy({ _id: userId });
        if (!user)
        {
            return null;
        }
        const hash = crypto.createHash('sha256').update(user.email.trim()).digest('hex');
        user.avatarURL = `https://gravatar.com/avatar/${hash}?s=256&d=initials`;
        await user.save();
        return user;
    }

    async deleteUser(userId: string): Promise<User | null>
    {
        const user = await User.findOneBy({ _id: userId });
        if(!user) return null;
        await user.remove();
        return user;
    }

    async searchUsers(searchTerm: string): Promise<User[]>
    {
        const users = await this.readUsers();
        const filteredUsers = users.filter(u =>
            (u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.email.toLowerCase().includes(searchTerm.toLowerCase())));
        return filteredUsers;
    }

}