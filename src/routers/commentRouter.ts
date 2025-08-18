import { Router } from 'express';
import CommentController from '../controllers/commentController';
import CommentValidator from '../middlewares/validation/commentValidation';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { isCommentAuthor } from '../middlewares/auth/isCommentAuthor';

const commentController = new CommentController();

const CommentRouter = Router();

CommentRouter.post('/:postId', isAuthenticated, CommentValidator, commentController.saveComment);

CommentRouter.put('/:commentId', isAuthenticated, isCommentAuthor, CommentValidator, commentController.updateComment)

CommentRouter.delete('/:commentId', isAuthenticated, isCommentAuthor, commentController.deleteComment);

CommentRouter.post('/:commentId/like', isAuthenticated, commentController.like)

CommentRouter.delete('/:commentId/like', isAuthenticated, commentController.unlike);

export default CommentRouter;