import React, { useState } from "react";

const API_URL = "/auth"; // Flask backend URL with Blueprint prefix

const App: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	// Handle sign up
	const handleSignUp = async () => {
		try {
			const response = await axios.post(`${API_URL}/signup`, {
				username,
				password,
			});
			setMessage(response.data.message);
		} catch (error: any) {
			setMessage(error.response?.data?.error || "An error occurred");
		}
	};

	// Handle login
	const handleLogin = async () => {
		try {
			const response = await axios.post(`${API_URL}/login`, {
				username,
				password,
			});
			setMessage(`Welcome ${response.data.username}`);
		} catch (error: any) {
			setMessage(error.response?.data?.error || "Invalid credentials");
		}
	};

	// Check if logged in
	const checkLoggedIn = async () => {
		try {
			const response = await axios.get(`${API_URL}/me`, {
				withCredentials: true,
			});
			setMessage(response.data.message);
		} catch (error: any) {
			setMessage("You are not logged in");
		}
	};

	// Handle logout
	const handleLogout = async () => {
		try {
			await axios.post(`${API_URL}/logout`);
			setMessage("You have been logged out");
		} catch (error: any) {
			setMessage("Error logging out");
		}
	};

	return (
		<div>
			<h1>React Flask Authentication</h1>

			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<button onClick={handleSignUp}>Sign Up</button>
			<button onClick={handleLogin}>Login</button>

			<div>
				<button onClick={checkLoggedIn}>Check if Logged In</button>
				<button onClick={handleLogout}>Logout</button>
			</div>

			<p>{message}</p>
		</div>
	);
};

export default App;
