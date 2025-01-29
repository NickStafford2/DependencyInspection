import React, { createContext, useState, useContext } from "react";

// Create the context
const MyContext = createContext();

// Create a provider component
export const MyContextProvider = ({ children }) => {
	const [messages, setMessages] = useState<string[]>([]);

	return (
		<MyContext.Provider value={{ messages, setMessages }}>
			{children}
		</MyContext.Provider>
	);
};

// Create a custom hook for consuming the context
export const useMyContext = () => useContext(MyContext);
