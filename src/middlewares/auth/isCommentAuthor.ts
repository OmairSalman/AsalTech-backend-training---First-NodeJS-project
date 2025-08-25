import { Request, Response, NextFunction } from 'express';
import { CommentModel } from '../../models/commentModel';

export async function isCommentAuthor(request: Request, response: Response, next: NextFunction)
{
    const userId = request.user?.id;
    const commentId = request.params.commentId;

    const comment = await CommentModel.findById(commentId);
    if(!comment)
        return response.status(404).send("Comment not found");
    if(!comment.author.equals(userId))
        return response.status(404).send("You're not allowed to perform this action on this comment");
    next();
}