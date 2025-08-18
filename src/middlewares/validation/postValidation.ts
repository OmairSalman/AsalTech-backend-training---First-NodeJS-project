import { Request, Response, NextFunction } from 'express';

export default function PostValidator(request: Request, response: Response, next: NextFunction)
{
    const post = request.body;

    if(!post.title || !post.content)
        return response.status(400).send("Invalid post data");
    next();
}