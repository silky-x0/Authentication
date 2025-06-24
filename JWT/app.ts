import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// @ts-ignore
import cookieParser from 'cookie-parser';
const app = express();

app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    let token = jwt.sign({email:"10akhil.t@gmail.com"},"Secret_key")
    res.cookie("token", token)
    res.send('Hello World');
    console.log(token)
});

app.get('/v1',(req: Request, res: Response) => {
    res.send('cookies stuck');
    console.log(req.cookies.token);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});