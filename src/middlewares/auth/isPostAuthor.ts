import { Request, Response, NextFunction } from 'express';
import { Post } from '../../models/postEntity';

export async function isPostAuthor(request: Request, response: Response, next: NextFunction)
{
    const userId = request.user?._id;
    const postId = request.params.postId;

    const post = await Post.findOneBy({_id: postId});
    if(!post)
        return response.status(404).send("Post not found");
    if(post.author._id !== userId)
        return response.status(403).send("You're not allowed to perform this action on this post");
    next();
}