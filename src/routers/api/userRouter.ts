import { Router } from 'express';
import UserController from '../../controllers/api/userController';
import { isAuthenticated } from '../../middlewares/auth/isAuthenticated';
import { isAdmin } from '../../middlewares/auth/isAdmin';

const usersController = new UserController();

const UserRouter = Router();

UserRouter.get('/', isAuthenticated, isAdmin, usersController.getUsers);

UserRouter.get('/search', isAuthenticated, usersController.searchUsers);

UserRouter.get('/:id', isAuthenticated, isAdmin, usersController.getUserById);

UserRouter.put('/:id', isAuthenticated, usersController.updateUser);

UserRouter.delete('/:id', isAuthenticated, usersController.deleteUser);

UserRouter.get('/:userId/posts', isAuthenticated, usersController.getUserPosts)

UserRouter.put('/:userId/toggle-admin', isAuthenticated, isAdmin, usersController.toggleAdmin);

export default UserRouter;