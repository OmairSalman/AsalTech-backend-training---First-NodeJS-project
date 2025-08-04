import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document
{
    name: string,
    email: string,
    password: string
};

const userSchema = new Schema<User>(
{
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

export const Users = mongoose.model('Users', userSchema);