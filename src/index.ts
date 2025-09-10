import express from 'express';
import path from 'path';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { engine } from 'express-handlebars';
import cookieParser from "cookie-parser";

import WebRouter from './routers/web/webRouter';
import UserRouter from './routers/api/userRouter';
import AuthRouter from './routers/api/authRouter';
import PostRouter from './routers/api/postRouter';
import CommentRouter from './routers/api/commentRouter';

import AppDataSource from './config/dataSource';

import dotenv from 'dotenv';
import { PublicUser } from './utils/publicTypes';
import hbsHelpers from './views/helpers/hbsHelpers';

dotenv.config();

dayjs.extend(relativeTime);

const app = express();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: hbsHelpers
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

AppDataSource.initialize()
  .then(() => {
      console.log(`Data Source has been initialized! Connected successfully to mysql DB: ${process.env.DATABASE_NAME}`);
  })
  .catch((error) => {
      console.error("Error during Data Source initialization:\n", error);
  });

app.listen(process.env.PORT, async () => { console.log(`Server running at http://localhost:${process.env.PORT}/`) });

app.use('/', WebRouter);

app.use('/users', UserRouter);

app.use('/auth', AuthRouter);

app.use('/posts', PostRouter);

app.use('/comments', CommentRouter);