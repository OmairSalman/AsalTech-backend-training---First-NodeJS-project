import { Request, Response } from "express";
import CommentService from "../../services/commentService";

const commentService = new CommentService();

export default class CommentController
{
    async saveComment(request: Request, response: Response)
    {
        const postId = request.params.postId;
        const comment = request.body;
        const author = request.session!.user!.id.toString();
        const savedComment = await commentService.saveComment(postId, comment, author);
        return response.status(200).json(savedComment);
    }

    async updateComment(request: Request, response: Response)
    {
        let commentId = request.params.commentId;
        const comment = request.body;
        const updatedComment = await commentService.updateComment(commentId, comment);
        if(!updatedComment) return response.status(404).send("Comment not found");
        return response.status(200).json({message: "Comment update successfully", comment: updatedComment});
    }

    async deleteComment(request: Request, response: Response)
    {
        let commentId = request.params.commentId;
        const deletedComment = await commentService.deleteComment(commentId);
        if(!deletedComment) return response.status(404).send("Comment not found");
        return response.status(200).json({message: "Comment deleted successfully", comment: deletedComment});
    }

    async like(request: Request, response: Response)
    {
        let commentId = request.params.commentId;
        let userId = request.session!.user!.id.toString();
        const likedComment = await commentService.like(commentId, userId);
        if(!likedComment) return response.status(404).send("Comment not found");
        return response.status(200).send({message: `Liked comment ${commentId} by ${userId} successfully.`, comment: likedComment});
    }

    async unlike(request: Request, response: Response)
    {
        let commentId = request.params.commentId;
        let userId = request.session!.user!.id.toString();
        const likedComment = await commentService.unlike(commentId, userId);
        if(!likedComment) return response.status(404).send("Comment not found");
        return response.status(200).send({message: `Unliked comment ${commentId} by ${userId} successfully.`, comment: likedComment});
    }
}