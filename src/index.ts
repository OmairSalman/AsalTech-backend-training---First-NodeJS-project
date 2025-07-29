import express, { Request, Response } from 'express';
import * as UsersService from './services/users';

const app = express()
const port = 3000

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.get('/users', UsersService.getUsers);

app.get('/users/search', UsersService.searchUsers);

app.get('/users/:id', UsersService.getUserById);

app.post('/users', UsersService.createUser);

app.put('/users/:id', UsersService.updateUser);

app.delete('/users/:id', UsersService.deleteUser);

app.post('/users/login', UsersService.loginUser);