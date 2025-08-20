import express from 'express';
import path from 'path';

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

const app = express();
const port = 3000;

connectDB();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
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