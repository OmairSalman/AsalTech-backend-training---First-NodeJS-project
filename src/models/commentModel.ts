import mongoose, { Schema } from 'mongoose';
import { Comment } from '../interfaces/comment';

const commentSchema = new Schema<Comment>(
{
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: {type: String, required: true},
    likes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }
},
{ timestamps: true });

export const CommentModel = mongoose.model('Comment', commentSchema);