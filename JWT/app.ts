import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.get("/", (req: Request, res: Response) => {
	let token = jwt.sign({ email: "10akhil.t@gmail.com" }, "Secret_key");
	res.cookie("token", token, {
		httpOnly: true,
		secure: false, 
		sameSite: "lax",
	});
	res.send("Hello World");
	console.log(token);
});

app.get("/v1", (req: Request, res: Response) => {
	res.send("cookies stuck");
	let data = jwt.verify(req.cookies.token, "Secret_key");
	console.log(data);
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
