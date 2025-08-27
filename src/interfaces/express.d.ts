import * as express from 'express';
import { Types } from 'mongoose';

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