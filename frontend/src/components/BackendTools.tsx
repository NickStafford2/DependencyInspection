import { Button } from "./ui/button";
import { CopyTimestamp } from "./CopyTimestamp";
import { useState } from "react";
import { Input } from "./ui/input";

const BackendTools = () => {
	const [responseMessage, setResponseMessage] = useState<string>("");
	const [apiText, setApiText] = useState("data/test");

	const _callBackend = async (route: string) => {
		try {
			const url = `/api/${route}`;
			const response = await fetch(url);
			if (!response.ok) {
				const errorMessage = `Failed to call: ${url}`;
				setResponseMessage(errorMessage);
				throw new Error(errorMessage);
			}
			const data = await response.json();
			setResponseMessage(data);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<nav className="flex  flex-row gap-4 bg-gradient-to-t from-black to-gray-800  w-full">
			<CopyTimestamp></CopyTimestamp>
			<Button onClick={() => _callBackend("migrations/upgrade")}>
				DB Migration Update
			</Button>
			<Button disabled={true} onClick={() => _callBackend("clearCache")}>
				Clear Cache
			</Button>
			<Button onClick={() => _callBackend("data/scrapeAllPackages")}>
				Scrape Everything
			</Button>
			<div className="flex flex-row">
				<Button
					className="rounded-r-none border-2 border-r-0 border-black"
					onClick={() => _callBackend(apiText)}
				>
					Test Api:
				</Button>
				<Input
					className="grow-0 w-64 rounded-l-none border-2 border-l-0"
					defaultValue={apiText}
					onChange={(e) => setApiText(e.target.value)}
				></Input>
			</div>
			<span>{responseMessage}</span>
		</nav>
	);
};

export default BackendTools;
