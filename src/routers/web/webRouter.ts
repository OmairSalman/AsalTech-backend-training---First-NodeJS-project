import { Router } from 'express';
import WebController from '../../controllers/web/webController';

const webController = new WebController();

const WebRouter = Router();

WebRouter.get('/', webController.home);

WebRouter.get('/login', webController.login);

WebRouter.get('/register', webController.register);

export default WebRouter;