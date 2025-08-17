import { Document, Types } from 'mongoose';

export interface Comment extends Document
{
    post: Types.ObjectId,
    author: Types.ObjectId,
    content: string,
    likes: Types.ObjectId[]; 
    createdAt: Date;
    updatedAt: Date;
};