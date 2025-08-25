import * as express from 'express';
import { Types } from 'mongoose';

export default interface UserPayload {
  _id: Types.ObjectId;
  name: string;
  email: string;
  hasCustomAvatar?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}