import UserService from "../services/userService";
import { User
    
 } from "../interfaces/user";
const userService = new UserService();

export default class AuthService
{
    async loginUser(credentials: {email: string, password: string}): Promise<User | null>
    {
        const users = await userService.readUsers();
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (!user) return null;
        else return user.toObject();
    }
}