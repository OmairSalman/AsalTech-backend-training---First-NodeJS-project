import { Router } from 'express';
import UserController from '../controllers/userController';

const usersController = new UserController();

const UserRouter = Router();

UserRouter.get('/', usersController.getUsers);

UserRouter.get('/view', usersController.renderUsers);

UserRouter.get('/search', usersController.searchUsers);

UserRouter.get('/:id', usersController.getUserById);

UserRouter.post('/', usersController.createUser);

UserRouter.put('/:id', usersController.updateUser);

UserRouter.delete('/:id', usersController.deleteUser);

export default UserRouter;