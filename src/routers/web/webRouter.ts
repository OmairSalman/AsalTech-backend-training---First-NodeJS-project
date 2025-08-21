import { Router } from 'express';
import WebController from '../../controllers/web/webController';

const webController = new WebController();

const WebRouter = Router();

WebRouter.get('/', webController.home);

WebRouter.get('/feed', webController.feed);

WebRouter.get('/login', webController.login);

WebRouter.get('/register', webController.register);

WebRouter.get('/create', webController.create);

WebRouter.get('/profile', webController.profile);

export default WebRouter;