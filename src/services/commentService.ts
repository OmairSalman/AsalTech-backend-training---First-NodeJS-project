import mongoose from "mongoose";
import { Comment } from "../interfaces/comment";
import { CommentModel } from "../models/commentModel";

export default class CommentService
{
    async saveComment(postId: string, newComment: Comment, userId: string): Promise<Comment | null>
    {
        try
        {
            const comment = new CommentModel({...newComment, author: userId, post: postId});
            await comment.save();
            const populatedComment = await CommentModel.findById(comment._id).populate('author');
            if(populatedComment)
                return populatedComment.toObject()
            return null;
        }
        catch(error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error saving comment:`, error);
            return null;
        }
    }

    async countUserCommentsLikes(userId: string)
    {
        const comments = await CommentModel.find({author: userId});
        if(comments)
        {
            let commentsLikes = 0;
            comments.forEach(comment =>{
                commentsLikes += comment.likes.length;
            });
            return commentsLikes;
        }
    }

    async updateComment(commentId: string, updatedComment: Comment): Promise<Comment | null>
    {
        try
        {
            const comment = await CommentModel.findByIdAndUpdate(commentId, updatedComment, { new: true });
            return comment?.toObject() ?? null;
        }
        catch(error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error updating comment:`, error);
            return null;
        }
    }

    async deleteComment(commentId: string): Promise<Comment | null>
    {
        try
        {
            const comment = await CommentModel.findByIdAndDelete(commentId);
            return comment?.toObject() ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error deleting comment:`, error);
            return null;
        }
    }

    async like(commentId: string, userId: string): Promise<Comment | null>
    {
        try
        {
            const comment = await CommentModel.findByIdAndUpdate(
                commentId,
                { $addToSet: { likes: new mongoose.Types.ObjectId(userId) } },
                { new: true }
            ).populate('likes', 'name');;
            return comment?.toObject() ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error liking comment:`, error);
            return null;
        }
    }

    async unlike(commentId: string, userId: string): Promise<Comment | null>
    {
        try
        {
            const comment = await CommentModel.findByIdAndUpdate(
                commentId,
                { $pull: { likes: new mongoose.Types.ObjectId(userId) } },
                { new: true }
            ).populate('likes', 'name');;
            return comment?.toObject() ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error unliking comment:`, error);
            return null;
        }
    }
}