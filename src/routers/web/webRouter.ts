import { Router } from 'express';
import { isAuthenticated } from '../../middlewares/auth/isAuthenticated';
import WebController from '../../controllers/web/webController';
import { isAdmin } from '../../middlewares/auth/isAdmin';

const webController = new WebController();

const WebRouter = Router();

WebRouter.get('/', webController.home);

WebRouter.get('/feed', isAuthenticated, webController.feed);

WebRouter.get('/login', webController.login);

WebRouter.get('/register', webController.register);

WebRouter.get('/create', isAuthenticated, webController.create);

WebRouter.get('/profile', isAuthenticated, webController.profile);

WebRouter.get('/profile/edit', isAuthenticated, webController.editProfile);

WebRouter.get('/profile/:userId', isAuthenticated, webController.showUserProfile);

WebRouter.get('/admin/users', isAuthenticated, isAdmin, webController.adminUsersPanel);

export default WebRouter;