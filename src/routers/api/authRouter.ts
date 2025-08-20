import { Router } from 'express';
import AuthController from '../../controllers/api/authController';
import UserValidator from '../../middlewares/validation/userValidation';

const authController = new AuthController();

const AuthRouter = Router();

AuthRouter.post('/login', authController.loginUser);

AuthRouter.post('/register', UserValidator, authController.registerUser);

AuthRouter.get('/profile/:id', authController.showProfileById);

AuthRouter.get('/logout', authController.logoutUser)

export default AuthRouter;