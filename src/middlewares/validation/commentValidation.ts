import { Request, Response, NextFunction } from 'express';

export default function CommentValidator(request: Request, response: Response, next: NextFunction)
{
    const comment = request.body;

    if(!comment.content || !comment.post)
        return response.status(400).send("Invalid comment data");

    next();
}