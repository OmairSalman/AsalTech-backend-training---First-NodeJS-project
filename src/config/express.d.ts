import * as express from 'express';
export default interface UserPayload {
  _id: string;
  name: string;
  email: string;
  avatarURL: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}