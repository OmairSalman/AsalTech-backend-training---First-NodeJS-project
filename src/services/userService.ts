import { User } from '../interfaces/user';
import { UserModel } from '../models/userModel';

export default class UserService
{
    async readUsers(): Promise<User[]>
    {
        try
        {
            return await UserModel.find({});
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
        const userDoc = await UserModel.findById(userId);
        const user = userDoc?.toObject();
        if (!user) return null;
        else return user;
    }

    async createUser(newUser: User): Promise<User | null>
    {
        const user = new UserModel(newUser);
        await user.save();
        return user.toObject();
    }

    async updateUser(userId: string, updatedUser: User): Promise<User | null>
    {
        await UserModel.findByIdAndUpdate(userId, updatedUser);
        const user = await UserModel.findById(userId);
        if (!user)
        {
            return null;
        }
        return user.toObject();
    }

    async deleteUser(userId: string): Promise<User | null>
    {
        const userDoc = await UserModel.findByIdAndDelete(userId);
        const user = userDoc?.toObject();
        if(!user) return null;
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