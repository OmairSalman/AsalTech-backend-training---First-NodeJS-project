import { Router } from 'express';
import AuthController from '../controllers/authController';
/*import UserController from '../controllers/userController';

const usersController = new UserController();
*/
const authController = new AuthController();

const AuthRouter = Router();

AuthRouter.post('/', authController.loginUser);

export default AuthRouter;