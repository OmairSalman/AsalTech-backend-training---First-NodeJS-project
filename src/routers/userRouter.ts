import { Router } from 'express';
import UserController from '../controllers/userController';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';

const usersController = new UserController();

const UserRouter = Router();

UserRouter.get('/', usersController.getUsers);

UserRouter.get('/view', usersController.renderUsers);

UserRouter.get('/search', usersController.searchUsers);

UserRouter.get('/:id', usersController.getUserById);

UserRouter.put('/:id', usersController.updateUser);

UserRouter.delete('/:id', usersController.deleteUser);

UserRouter.get('/posts/:userId', isAuthenticated, usersController.getUserPosts)

export default UserRouter;