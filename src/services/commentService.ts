import { Comment } from "../interfaces/comment";
import { CommentModel } from "../models/commentModel";

export default class CommentService
{
    async saveComment(newComment: Comment, userId: string): Promise<Comment | null>
    {
        try
        {
            const comment = new CommentModel({...newComment, author: userId});
            await comment.save();
            return comment.toObject();
        }
        catch(error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error saving comment:`, error);
            return null;
        }
    }
}