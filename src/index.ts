import express from 'express';
import path from 'path';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Types } from 'mongoose';
import MongoStore from "connect-mongo";
import { engine } from 'express-handlebars';

import session from 'express-session';

import WebRouter from './routers/web/webRouter';
import UserRouter from './routers/api/userRouter';
import AuthRouter from './routers/api/authRouter';
import PostRouter from './routers/api/postRouter';
import CommentRouter from './routers/api/commentRouter';

import connectDB from './config/db';

dayjs.extend(relativeTime);

const app = express();
const port = 3000;

connectDB();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    // comparison helpers
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
      if (count === 1) return `${count} ${singular}`;
      return `${count} ${plural}`;
    },

    isLiked: (likes: {_id: Types.ObjectId, name: string}[], userId: Types.ObjectId) =>
      {
        if(!likes || likes.length === 0)
          return false;
        const liked = likes.find(like => like._id.equals(userId));
        if(liked)
          return true;
        else
          return false;
      },
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

declare module 'express-session'
{
    interface SessionData
    {
      user?:
      {
        id: Types.ObjectId;
        name: string;
        email: string;
      };
    }
}

app.use(session({
  secret: 'omairs-hard-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/usersconnect",
  }),
  cookie: {
    httpOnly: true, 
    maxAge: 1000 * 60 * 60,
  }
}));

app.listen(port, () => { console.log(`Server running at http://localhost:${port}/`) })

app.use('/', WebRouter);

app.use('/users', UserRouter);

app.use('/auth', AuthRouter);

app.use('/posts', PostRouter);

app.use('/comments', CommentRouter)