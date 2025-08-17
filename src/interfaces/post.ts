import { Document, Types } from 'mongoose';

export interface Post extends Document
{
    author: Types.ObjectId,
    title: string,
    content: string,
    likes: Types.ObjectId[]; 
    createdAt: Date;
    updatedAt: Date;
};