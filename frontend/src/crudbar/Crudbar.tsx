import { Button } from "@/components/ui/button";
import { GraphData } from "@/utils/models";
import { PackageJSONUpload } from "@/components/PackageJSONUpload";
import { fetchGraphData } from "@/crudbar/api";
import { useEffect, useState } from "react";
import QuerySearch from "./QuerySearch";

function Crudbar({ onResponse }: { onResponse: (data: GraphData) => void }) {
	const [messages, setMessages] = useState<string[]>([]);
	const [sse, setSse] = useState<EventSource | null>(null); // State to manage the EventSource connection

	const startSSEConnection = () => {
		console.log("startSSEConnection");
		if (!sse) {
			const sseConnection = new EventSource("api/sse", {
				withCredentials: false,
			});
			sseConnection.onmessage = (e) => {
				console.log("Received data:", e.data);
				setMessages((prevMessages) => [...prevMessages, e.data]);
			};
			sseConnection.onerror = (e) => {
				console.error("SSE error:", e);
				sseConnection.close();
				setSse(null);
			};
			sseConnection.onopen = (e) => {
				console.log("SSE open ", e);
			};
			setSse(sseConnection);
		}
	};

	useEffect(() => {
		return () => {
			if (sse) {
				sse.close();
			}
		};
	}, [sse]);

	const getPopularNetwork = async () => {
		fetchGraphData("api/getPopularNetworks").then((data) => {
			if (data) onResponse(data);
		});
	};

	const getAllDBNetworks = async () => {
		fetchGraphData("api/getAllDBNetworks").then((data) => {
			if (data) onResponse(data);
		});
	};

	return (
		<nav className="px-3 py-2 flex flex-row justify-between items-center gap-3 bg-gradient-to-b from-black to-gray-800  w-full">
			<h2 className="text-white text-3xl whitespace-nowrap">
				Dependency Inspection
			</h2>
			{/* <Button onClick={() => startSSEConnection()}>Start</Button> */}
			<Button className="button-48" onClick={() => getAllDBNetworks()}>
				<span className="text">Get Full Network</span>
			</Button>
			{/* <Button className="button-48" onClick={() => getPopularNetwork()}> */}
			{/* <span className="text">getPopularNetwork</span> */}
			{/* </Button> */}
			{/* <PackageJSONUpload></PackageJSONUpload> */}
			<QuerySearch onResponse={onResponse} />
		</nav>
	);
}

export default Crudbar;
