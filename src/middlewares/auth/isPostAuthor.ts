import { Request, Response, NextFunction } from 'express';
import { PostModel } from '../../models/postModel';

export async function isPostAuthor(request: Request, response: Response, next: NextFunction)
{
    const userId = request.session.user?.id;
    const postId = request.body.postId;

    const post = await PostModel.findById(postId);
    if(!post)
        return response.status(404).send("Post not found");
    if(!post.author.equals(userId))
        return response.status(404).send("You're not allowed to perform this action on this post");
    next();
}