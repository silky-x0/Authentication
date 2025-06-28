import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

function ManageUser() {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		age: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:3000/register", {
				...form,
				age: parseInt(form.age),
			});
			console.log("User created:", res.data);
		} catch (error) {
			console.error("Registration error:", error);
		}
	};
	const navigate = useNavigate();
	const handleLogout = async () => {
		await fetch("http://localhost:3000/logout", {
			method: "GET",
			credentials: "include",
		});
		navigate("/");
	};

	return (
		<div className='w-full h-screen bg-zinc-900 flex justify-center items-center'>
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
					value={form.username}
					onChange={handleChange}
					className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
					required
				/>

				<input
					type='email'
					name='email'
					placeholder='Email'
					value={form.email}
					onChange={handleChange}
					className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
					required
				/>

				<input
					type='password'
					name='password'
					placeholder='Password'
					value={form.password}
					onChange={handleChange}
					className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
					required
				/>

				<input
					type='number'
					name='age'
					placeholder='Age'
					value={form.age}
					onChange={handleChange}
					className='px-3 py-2 rounded bg-zinc-700 text-white focus:outline-none'
				/>

				<button
					type='submit'
					className='bg-amber-500 hover:bg-amber-600 text-white py-2 rounded'
				>
					Register
				</button>
			</form>
			<button
				className='ml-8 px-6 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md shadow transition-colors duration-200 font-semibold'
				onClick={handleLogout}
			>
				Logout
			</button>
		</div>
	);
}

export default ManageUser;
