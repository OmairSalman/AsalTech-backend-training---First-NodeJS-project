import { Router } from 'express';
import UserController from '../../controllers/api/userController';
import { isAuthenticated } from '../../middlewares/auth/isAuthenticated';

const usersController = new UserController();

const UserRouter = Router();

UserRouter.get('/', isAuthenticated, usersController.getUsers);

UserRouter.get('/view', isAuthenticated, usersController.renderUsers);

UserRouter.get('/search', isAuthenticated, usersController.searchUsers);

UserRouter.get('/:id', isAuthenticated, usersController.getUserById);

UserRouter.put('/:id', isAuthenticated, usersController.updateUser);

UserRouter.delete('/:id', isAuthenticated, usersController.deleteUser);

UserRouter.get('/posts/:userId', isAuthenticated, usersController.getUserPosts)

export default UserRouter;