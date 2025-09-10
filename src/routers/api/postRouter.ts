import { Router } from 'express';
import PostController from '../../controllers/api/postController';
import PostValidator from '../../middlewares/validation/postValidation';
import { isAuthenticated } from '../../middlewares/auth/isAuthenticated';
import { isPostAuthor } from '../../middlewares/auth/isPostAuthor';

const postController = new PostController();

const PostRouter = Router();

PostRouter.use('/', isAuthenticated);

PostRouter.get('/', postController.getAllPosts);

PostRouter.get('/:postId', postController.getPost);

PostRouter.post('/', PostValidator, postController.savePost);

PostRouter.put('/:postId', isPostAuthor, PostValidator, postController.updatePost);

PostRouter.delete('/:postId', isPostAuthor, postController.deletePost);

PostRouter.post('/:postId/like', postController.like)

PostRouter.delete('/:postId/like', postController.unlike);

export default PostRouter;