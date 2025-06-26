import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

function App() {
	const navigate = useNavigate();

	const login = async () => {
		try {
			const res = await axios.get("http://localhost:3000/");
			console.log("Login response:", res.data);
		} catch (err) {
			console.error("Login error:", err);
		}
	};

	const verify = async () => {
		try {
			const res = await axios.get("http://localhost:3000/v1");
			console.log("Verify response:", res.data);
		} catch (err) {
			console.error("Verify error:", err);
		}
	};

	return (
		<div className='w-full h-screen bg-zinc-900 flex justify-center items-center'>
			<div className='flex flex-col items-center gap-4'>
				<h1 className='text-3xl text-amber-50 font-bold mb-4'>JWT Auth Demo</h1>

				<button
					onClick={login}
					className='px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow'
				>
					Login
				</button>

				<button
					onClick={verify}
					className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow'
				>
					Verify Token
				</button>
				<button
					onClick={() => navigate("/manage-user")}
					className='px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow'
				>
					Manage User
				</button>
			</div>
		</div>
	);
}

export default App;
