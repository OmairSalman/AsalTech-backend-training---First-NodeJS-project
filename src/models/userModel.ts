import mongoose, { Document, Schema } from 'mongoose';
import { User } from '../types/user';

interface UserDocument extends Omit<User, 'id'>, Document {};

const userSchema = new Schema<UserDocument>(
{
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
});

export const UserModel = mongoose.model('Users', userSchema);