import { Router } from 'express';
import PostController from '../controllers/postController';
import PostValidator from '../middlewares/validation/postValidation';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { isPostAuthor } from '../middlewares/auth/isPostAuthor';

const postController = new PostController();

const PostRouter = Router();

PostRouter.get('/', isAuthenticated, postController.getAllPosts);

PostRouter.get('/:postId', isAuthenticated, postController.getPost);

PostRouter.post('/', isAuthenticated, PostValidator, postController.savePost);

PostRouter.put('/:postId', isAuthenticated, isPostAuthor, PostValidator, postController.updatePost);

PostRouter.delete('/:postId', isAuthenticated, isPostAuthor, postController.deletePost);

PostRouter.post('/:postId/like', isAuthenticated, postController.like)

PostRouter.delete('/:postId/like', isAuthenticated, postController.unlike);

export default PostRouter;