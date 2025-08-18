import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import session from 'express-session';
import UserRouter from './routers/userRouter';
import AuthRouter from './routers/authRouter';
import connectDB from './config/db';

const app = express();
const port = 3000;

connectDB();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

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
  cookie: {
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24 * 30,
  }
}));

app.listen(port, () => { console.log(`Server running at http://localhost:${port}/`) })

app.get('/', (req: Request, res: Response) => { res.render('index') })

app.use('/users', UserRouter);

app.use('/auth', AuthRouter);