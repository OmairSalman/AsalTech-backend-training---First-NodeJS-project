import mongoose, { Schema } from 'mongoose';
import { Post } from '../interfaces/post';

const postSchema = new Schema<Post>(
{
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: true},
    content: {type: String, required: true},
    likes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] }
},
{ timestamps: true });

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

export const PostModel = mongoose.model('Post', postSchema);