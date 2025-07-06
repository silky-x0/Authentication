import express from "express";
import basicAuth from "express-basic-auth";
import { Request, Response } from "express";

const app = express();

app.use(
	basicAuth({
		users: { akhil: "1234" },
		challenge: true,
		unauthorizedResponse: "Create Account bruh",
	})
);

app.get("/", (req: Request, res: Response) => {
	console.log("On the main page");
});

app.get("/secure", (req: Request, res: Response) => {
	console.log("logged In");
	res.send("Logged in");
});

//above we have done basic Auth i.e Authorization: Basic <base64(username:password)> and for token based abd cookie based we
// already did in JWT part

app.listen(3000, () => {
	console.log("Server is Running");
});
