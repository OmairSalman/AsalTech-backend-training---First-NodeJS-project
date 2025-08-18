import { Request, Response } from "express";
import mongoose from "mongoose";
import CommentService from "../services/commentService";

const commentService = new CommentService();

export default class CommentController
{
    async saveComment(request: Request, response: Response)
    {
        const comment = request.body;
        const author = request.session!.user!.id.toString();
        const savedComment = await commentService.saveComment(comment, author);
        return response.status(200).json(savedComment);
    }
}