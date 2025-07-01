import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

axios.defaults.withCredentials = true;

function ManageUser() {
	const [registerForm, setRegisterForm] = useState({
		username: "",
		email: "",
		password: "",
		age: "",
	});
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});
	const [loggedIn, setLoggedIn] = useState(false);

	const checkAuth = async () => {
		try {
			await axios.get("http://localhost:3000/v1");
			setLoggedIn(true);
		} catch {
			setLoggedIn(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
	};

	const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:3000/register", {
				...registerForm,
				age: parseInt(registerForm.age),
			});
			console.log("User created:", res.data);
			await checkAuth();
		} catch (error) {
			console.error("Registration error:", error);
		}
	};
	const handleLogout = async () => {
		await fetch("http://localhost:3000/logout", {
			method: "GET",
			credentials: "include",
		});
		setLoggedIn(false);
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:3000/login", {
				email: loginForm.email,
				password: loginForm.password,
			});
			console.log("User logged in:", res.data);
			await checkAuth();
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	const { loginWithRedirect, isAuthenticated, user } = useAuth0();

	return (
		<div className='w-full h-screen bg-zinc-900 flex flex-col items-center'>
			<button
				className={`mt-8 mb-8 px-8 py-2 rounded-full font-bold shadow ${
					loggedIn || (isAuthenticated && user && user.email)
						? "bg-green-500 hover:bg-green-600 text-white"
						: "bg-red-500 hover:bg-red-600 text-white"
				}`}
				disabled
			>
				{loggedIn || (isAuthenticated && user && user.email) ? "Logged In" : "Not Logged In"}
			</button>
			<div className='flex flex-row items-start gap-8'>
				<form
					onSubmit={handleSubmit}
					className='bg-zinc-800 p-6 rounded-md shadow-md flex flex-col gap-4 w-80'
				>
					<h2 className='text-white text-2xl text-center font-semibold'>
						Register User
					</h2>

					<input
						type='text'
						name='username'
						placeholder='Username'
						value={registerForm.username}
						onChange={handleRegisterChange}
						className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
						required
					/>

					<input
						type='email'
						name='email'
						placeholder='Email'
						value={registerForm.email}
						onChange={handleRegisterChange}
						className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
						required
					/>

					<input
						type='password'
						name='password'
						placeholder='Password'
						value={registerForm.password}
						onChange={handleRegisterChange}
						className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
						required
					/>

					<input
						type='number'
						name='age'
						placeholder='Age'
						value={registerForm.age}
						onChange={handleRegisterChange}
						className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
					/>

					<button
						type='submit'
						className='bg-amber-500 hover:bg-amber-600 text-white py-2 rounded'
					>
						Register
					</button>
				</form>
				{loggedIn ? (
					<button
						className='px-6 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md shadow transition-colors duration-200 font-semibold self-center'
						onClick={handleLogout}
					>
						Logout
					</button>
				) : (
					<form
						onSubmit={handleLogin}
						className='bg-zinc-800 p-6 rounded-md shadow-md flex flex-col gap-4 w-80'
					>
						<h2 className='text-white text-2xl text-center font-semibold'>
							User Login
						</h2>

						<input
							type='email'
							name='email'
							placeholder='Email'
							value={loginForm.email}
							onChange={handleLoginChange}
							className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
							required
						/>

						<input
							type='password'
							name='password'
							placeholder='Password'
							value={loginForm.password}
							onChange={handleLoginChange}
							className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
							required
						/>

						<button
							type='submit'
							className='bg-amber-500 hover:bg-amber-600 text-white py-2 rounded'
						>
							Login
						</button>
					</form>
				)}
			</div>
			<div className='flex flex-col gap-5 m-7'>
				<button
					onClick={() => loginWithRedirect()}
					className=' rounded-md text-white bg-black p-3'
				>
					Login Via OAuth
				</button>
			</div>
		</div>
	);
}

export default ManageUser;
