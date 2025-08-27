import express from 'express';
import path from 'path';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
;
import { engine } from 'express-handlebars';
import cookieParser from "cookie-parser";

import WebRouter from './routers/web/webRouter';
import UserRouter from './routers/api/userRouter';
import AuthRouter from './routers/api/authRouter';
import PostRouter from './routers/api/postRouter';
import CommentRouter from './routers/api/commentRouter';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

import AppDataSource from './config/dataSource';

dayjs.extend(relativeTime);

const app = express();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers:
  {
    eq: (a: number, b: number) => a === b,
    gt: (a: number, b: number) => a > b,
    lt: (a: number, b: number) => a < b,
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b,
    range: (start: number, end: number) =>
    {
      const arr = [];
      for (let i = start; i <= end; i++)
      {
        arr.push(i);
      }
      return arr;
    },

    // date formatting
    formatDate: (date: Date) => dayjs(date).format("MMM D, YYYY h:mm A"),

    // relative time (need dayjs/plugin/relativeTime)
    fromNow: (date: string) => dayjs(date).fromNow(),

    // pluralize likes or comments
    pluralize: (count: number, singular: string, plural: string) => {
      if (count === 1) return `${singular}`;
      return `${plural}`;
    },

    isLiked: (likes: {_id: string, name: string}[], userId: string) =>
    {
      if(!likes || likes.length === 0)
        return false;
      const liked = likes.find(like => like._id === userId);
      if(liked)
        return true;
      else
        return false;
    },

    isAuthor: (postAuthorId: string, userId: string) => postAuthorId === userId,

    isOwner: (currentUserId: string, profileUserId: string) => profileUserId === currentUserId,
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

AppDataSource.initialize();
app.listen(process.env.PORT, () => { console.log(`Server running at http://localhost:${process.env.PORT}/`) });

app.use('/', WebRouter);

app.use('/users', UserRouter);

app.use('/auth', AuthRouter);

app.use('/posts', PostRouter);

app.use('/comments', CommentRouter)