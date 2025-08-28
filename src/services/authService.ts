import UserService from "../services/userService";
import { User } from "../models/userEntity";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default class AuthService
{
    async loginUser(credentials: {email: string, password: string}): Promise<User | string>
    {
        try
        {
            const user = await User.findOneBy({email: credentials.email});
            if (!user) return 'DNE';
            const match = await bcrypt.compare(credentials.password, user.password);
            if(match)
                return user;
            else
                return 'ICR';
        }
        catch(error)
        {
            const errorDate = new Date();
            const errorDateString = errorDate.toLocaleDateString();
            const errorTimeString = errorDate.toLocaleTimeString();
            console.error(`[${errorDateString} @ ${errorTimeString}] Error logging in: `, error);
        }
        return 'error';
    }

    async registerUser(newUser: User): Promise<User | null>
    {
        const user = new User();
        user.name = newUser.name;
        user.email = newUser.email;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newUser.password, salt);
        const hash = crypto.createHash('sha256').update(user.email.trim()).digest('hex');
        user.avatarURL = `https://gravatar.com/avatar/${hash}?s=256&d=initials`;
        await user.save();
        return user;
    }
}