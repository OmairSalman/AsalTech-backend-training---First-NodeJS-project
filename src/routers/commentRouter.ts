import { Router } from 'express';
import CommentController from '../controllers/commentController';
import CommentValidator from '../middlewares/validation/commentValidation';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';

const commentController = new CommentController();

const CommentRouter = Router();

CommentRouter.post('/', isAuthenticated, CommentValidator, commentController.saveComment);

export default CommentRouter;