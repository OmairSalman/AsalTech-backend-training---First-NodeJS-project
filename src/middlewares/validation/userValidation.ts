import { Request, Response, NextFunction } from 'express';

export default function UserValidator(request: Request, response: Response, next: NextFunction)
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
    
    next();
}