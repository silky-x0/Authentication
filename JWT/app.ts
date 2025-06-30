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


app.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, age } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, age });
    await user.save();
    res.status(201);
	const token = jwt.sign({email},"key",{expiresIn:"1h"})
	res.cookie("token",token,{
		httpOnly: true,
		sameSite: "lax",
		secure: false,
		maxAge: 3600000,
		path: "/",
	});
	res.send(user)
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).send("Registration failed");
  }
});

app.get("/logout", (req: Request, res: Response) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		path: "/",
	});
	res.status(200).send("Logged out");
});

app.post("/login", async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).send("User not found");
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).send("Invalid credentials");
		}
		const token = jwt.sign({ email: user.email }, "key", { expiresIn: "1h" });
		res.cookie("token", token, {
			httpOnly: true,
			sameSite: "lax",
			secure: false,
			maxAge: 3600000,
			path: "/",
		});
		res.status(200).send("Login successful");
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).send("Server error");
	}
});

app.get("/v1", (req: Request, res: Response) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).send("Not authenticated");
	}
	try {
		const data = jwt.verify(token, "key");
		res.status(200).send("Authenticated");
	} catch (err) {
		res.status(401).send("Invalid token");
	}
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

