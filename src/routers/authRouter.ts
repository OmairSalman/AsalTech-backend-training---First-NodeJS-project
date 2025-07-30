import { Router } from 'express';
import AuthController from '../controllers/authController';
/*import UserController from '../controllers/userController';

const usersController = new UserController();
*/
const authController = new AuthController();

const AuthRouter = Router();

AuthRouter.get('/login', authController.login);

AuthRouter.post('/login', authController.loginUser);

AuthRouter.get('/register', authController.register);

AuthRouter.post('/register', authController.registerUser);

export default AuthRouter;