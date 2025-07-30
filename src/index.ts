import express, { Request, Response } from 'express';
import UserRouter from './routers/userRouter';
import AuthRouter from './routers/authRouter';

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use('/users', UserRouter);

app.use('/login', AuthRouter);