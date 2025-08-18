import { Request, Response, NextFunction } from 'express';

export function CommentValidator(request: Request, response: Response, next: NextFunction)
{
    const comment = request.body;

    if(!comment.content)
        return response.status(400).send("Invalid comment data");

    next();
}