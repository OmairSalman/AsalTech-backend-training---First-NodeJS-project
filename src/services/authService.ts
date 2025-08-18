import UserService from "../services/userService";
import { UserModel } from "../models/userModel";
import { User } from "../interfaces/user";
import bcrypt from 'bcrypt';
const userService = new UserService();

export default class AuthService
{
    async loginUser(credentials: {email: string, password: string}): Promise<User | null>
    {
        try
        {
            const user = await UserModel.findOne({ email: credentials.email });
            if (!user) return null;
            const match = await bcrypt.compare(credentials.password, user?.password);
            if(match)
                return user.toObject();
        }
        catch(error)
        {
            const errorDate = new Date();
            const errorDateString = errorDate.toLocaleDateString();
            const errorTimeString = errorDate.toLocaleTimeString();
            console.error(`[${errorDateString} @ ${errorTimeString}] Error logging in: `, error);
        }
        return null;
    }

    async registerUser(newUser: User): Promise<User | null>
    {
        const user = new UserModel(newUser);
        await user.save();
        return user.toObject();
    }
}