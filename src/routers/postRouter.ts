import { Router } from 'express';
import PostController from '../controllers/postController';
import PostValidator from '../middlewares/validation/postValidation';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';

const postController = new PostController();

const PostRouter = Router();

PostRouter.get('/', isAuthenticated, postController.getAllPosts);

PostRouter.get('/:postId', isAuthenticated, postController.getPost);

PostRouter.post('/', isAuthenticated, PostValidator, postController.savePost);

export default PostRouter;