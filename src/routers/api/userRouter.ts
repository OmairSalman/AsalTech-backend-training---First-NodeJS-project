import { Router } from 'express';
import UserController from '../../controllers/api/userController';
import { isAuthenticated } from '../../middlewares/auth/isAuthenticated';
import { isAdmin } from '../../middlewares/auth/isAdmin';

const usersController = new UserController();

const UserRouter = Router();

UserRouter.use('/', isAuthenticated);

UserRouter.get('/', isAdmin, usersController.getUsers);

UserRouter.get('/search', usersController.searchUsers);

UserRouter.get('/:id', isAdmin, usersController.getUserById);

UserRouter.put('/:id', usersController.updateUser);

UserRouter.delete('/:id', usersController.deleteUser);

UserRouter.get('/:userId/posts', usersController.getUserPosts)

UserRouter.put('/:userId/toggle-admin', isAdmin, usersController.toggleAdmin);

export default UserRouter;