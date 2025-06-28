import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import User from "../models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

mongoose.connect("mongodb://127.0.0.1:27017/authdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

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

app.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, age } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, age });
    await user.save();
    res.status(201).send("User registered");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).send("Registration failed");
  }
});


app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
