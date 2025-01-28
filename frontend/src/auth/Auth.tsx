import React, { useState } from "react";

const API_URL = "/auth"; // Flask backend URL with Blueprint prefix

const App: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	// Handle sign up
	const handleSignUp = async () => {
		try {
			const response = await fetch(`${API_URL}/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			// Check if the response is successful
			if (response.ok) {
				const data = await response.json();
				setMessage(data.message);
			} else {
				const errorData = await response.json();
				setMessage(errorData.error || "An error occurred");
			}
		} catch {
			setMessage("An error occurred during signup.");
		}
	};

	// Handle login
	const handleLogin = async () => {
		try {
			const response = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			// Check if the response is successful
			if (response.ok) {
				const data = await response.json();
				setMessage(`Welcome ${data.username}`);
			} else {
				const errorData = await response.json();
				setMessage(errorData.error || "Invalid credentials");
			}
		} catch {
			setMessage("An error occurred during login.");
		}
	};

	// Check if logged in
	const checkLoggedIn = async () => {
		try {
			const response = await fetch(`${API_URL}/me`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // To include session cookies if needed
			});

			// Check if the response is successful
			if (response.ok) {
				const data = await response.json();
				setMessage(data.message);
			} else {
				setMessage("You are not logged in.");
			}
		} catch {
			setMessage("An error occurred while checking login status.");
		}
	};

	// Handle logout
	const handleLogout = async () => {
		try {
			const response = await fetch(`${API_URL}/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			// Check if the response is successful
			if (response.ok) {
				setMessage("You have been logged out.");
			} else {
				setMessage("Error logging out.");
			}
		} catch {
			setMessage("An error occurred during logout.");
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
