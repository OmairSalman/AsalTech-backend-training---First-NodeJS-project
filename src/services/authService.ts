import { User } from "../types/user";
import UserService from "../services/userService";

const userService = new UserService();

export default class AuthService
{
    loginUser(credentials: {email: string, password: string}): User | null
    {
        const users = userService.readUsers();
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (!user) return null;
        else return user;
    }
}