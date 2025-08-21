import mongoose, { Schema } from 'mongoose';
import { User } from '../interfaces/user';
import bcrypt from 'bcrypt';

const userSchema = new Schema<User>(
{
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
},
{ timestamps: true } );

userSchema.pre('save', async function (next)
{
    if (!this.isModified("password")) return next();
    try
    {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (err)
    {
        next(err as Error);
    }
});


export const UserModel = mongoose.model('User', userSchema);