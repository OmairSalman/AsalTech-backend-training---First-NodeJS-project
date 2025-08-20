import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import { engine } from 'express-handlebars';
import path from 'path';
import session from 'express-session';
import MongoStore from "connect-mongo";
import UserRouter from './routers/userRouter';
import AuthRouter from './routers/authRouter';
import PostRouter from './routers/postRouter';
import CommentRouter from './routers/commentRouter';
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

app.get('/', (req: Request, res: Response) => { res.render('pages/home') })

app.use('/users', UserRouter);

app.use('/auth', AuthRouter);

app.use('/posts', PostRouter);

app.use('/comments', CommentRouter)