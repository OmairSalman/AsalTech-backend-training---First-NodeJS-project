import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserPayload from '../../config/express';

export function isAuthenticated(request: Request, response: Response, next: NextFunction)
{
  const accessToken = request.cookies.accessToken;
  const refreshToken = request.cookies.refreshToken;

  if (!accessToken && ! refreshToken)
  {
    return response.redirect('/login');
  }

  try
  {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as UserPayload;

    request.user = decoded;

    return next();
  }
  catch (error)
  {
    if (!refreshToken)
      return response.redirect('/login');
  }

  try
  {
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as UserPayload;

    const newAccessToken = jwt.sign(
      {
        _id: decodedRefresh._id,
        name: decodedRefresh.name,
        email: decodedRefresh.email,
        avatarURL: decodedRefresh.avatarURL,
        isAdmin: decodedRefresh.isAdmin
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );

    response.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 15
    });

    request.user = decodedRefresh;
    return next();
  }
  catch (refreshErr)
  {
    return response.redirect('/login');
  }
}