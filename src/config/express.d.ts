import * as express from 'express';

export interface RefreshPayload
{
  _id: string
}

export interface UserPayload
{
  _id: string;
  name: string;
  email: string;
  avatarURL: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}