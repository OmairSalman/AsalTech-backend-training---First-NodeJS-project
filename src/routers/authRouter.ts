import { Router } from 'express';
import AuthController from '../controllers/authController';

const authController = new AuthController();

const AuthRouter = Router();

AuthRouter.get('/login', authController.login);

AuthRouter.post('/login', authController.loginUser);

AuthRouter.get('/register', authController.register);

AuthRouter.post('/register', authController.registerUser);

AuthRouter.get('/profile/:id', authController.showProfileById);

AuthRouter.get('/logout', authController.logoutUser)

export default AuthRouter;