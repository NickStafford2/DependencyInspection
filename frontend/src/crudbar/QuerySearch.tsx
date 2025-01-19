import { useState, useEffect } from "react";
import { GraphData } from "@/utils/models";
import { Button } from "@/components/ui/button";
import { fetchGraphData } from "@/crudbar/api";
import PackageTag from "./PackageTag";
import AddPackage from "./AddPackage";
import { Query } from "@/query";

export default function QuerySearch({
	onResponse,
}: { onResponse: (data: GraphData) => void }) {
	const [query, setQuery] = useState<Query>(new Query());
	const [queryUrl, setQueryUrl] = useState<string>("");
	const [messages, setMessages] = useState<string[]>([]);
	const [sse, setSse] = useState<EventSource | null>(null); // State to manage the EventSource connection

	const callBackend = async () => {
		fetchGraphData(query.toUrl()).then((data) => {
			if (data) onResponse(data);
		});
	};
	const removePackage = (name: string) => {
		console.log(name);
		// const oldQuery = query;
		console.log(query);
		query.packages.delete(name);
		setQuery(query);
		setQueryUrl(query.toUrl());
		console.log(query);
	};
	const addPackage = (name: string) => {
		if (name !== "") {
			query.packages.add(name);
			setQuery(query);
			setQueryUrl(query.toUrl());
		}
	};

	const startSSEConnection = () => {
		console.log("startSSEConnection");
		if (!sse) {
			const sseConnection = new EventSource(query.toUrl(), {
				withCredentials: false,
			});
			sseConnection.onmessage = (e) => {
				console.log("Received data:", e);
				setMessages((prevMessages) => [...prevMessages, e.lastEventId]);
				if (e.lastEventId == "network") {
					const graphData = JSON.parse(e.data);
					console.log(graphData);
					onResponse(graphData);
				}
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

	return (
		<div className="flex flex-row gap-2 items-stretch">
			{/* <span className="text-white">URL: '{queryUrl}'</span> */}
			<div className="flex flex-col gap-2 grow-0">
				<AddPackage onPackageAdded={addPackage} />
				{query.packages.size ? (
					<div className="flex flex-row w-64 flex-wrap justify-items-stretch gap-1">
						<span className="text-white whitespace-nowrap ">
							{query.packages.size > 1 ? "Seed Nodes:" : "Seed Nodes:"}
						</span>
						{Array.from(query.packages).map((name, index) => (
							<PackageTag
								className="flex-grow"
								name={name}
								onClose={removePackage}
								key={index}
							/>
						))}
					</div>
				) : (
					""
				)}
			</div>
			<div className="">
				{/* <Button className="h-full " onClick={callBackend}> */}
				<Button className="h-full " onClick={startSSEConnection}>
					Search
				</Button>
			</div>
		</div>
	);
}
