import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserPayload from '../../interfaces/express';

export function isAuthenticated(request: Request, response: Response, next: NextFunction)
{
  const token = request.cookies.token;

  if (!token)
  {
    return response.redirect('/login');
  }

  try
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    request.user = decoded;

    return next();
  }
  catch (error)
  {
    return response.status(403).json({ message: 'Invalid or expired token' });
  }
}