import express, { Request, Response } from 'express';

const app = express();

app.get('/', async (req: Request, res: Response) => {
  console.log('Hello world');
  res.send('Hello world');
});

const port = 8080;

app.listen(port, (): void => {
  console.log(`App is listening at http://localhost:${port}`);
});

console.log('Hello World');
