import express, { Request, Response } from 'express';
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

app.listen(port, () => { console.log(`Server running at http://localhost:${port}/`) })

app.get('/', (req: Request, res: Response) => { res.render('index') })

app.use('/users', UserRouter);

app.use('/auth', AuthRouter);