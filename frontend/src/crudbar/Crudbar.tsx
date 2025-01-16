import { useState } from "react";
import { Query } from "@/query";
import { Button } from "@/components/ui/button";
import { GraphData, isGraphData } from "@/utils/models";
import { PackageJSONUpload } from "@/components/PackageJSONUpload";
import PackageTag from "./PackageTag";
import AddPackage from "./AddPackage";

function Crudbar({ onResponse }: { onResponse: (data: GraphData) => void }) {
	const [query, setQuery] = useState<Query>(new Query());
	const [queryUrl, setQueryUrl] = useState<string>("");

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

	const fetchData = async (url: string) => {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				const message = `Failed to call ${url}`;
				// setResponseMessage(message);
				throw new Error(message);
			}
			const data = await response.json();
			if (isGraphData(data)) {
				onResponse(data);
			}
			// setResponseMessage(data);
		} catch (err) {
			console.error(err);
		}
	};

	const getPopularNetwork = async () => {
		fetchData("api/getPopularNetworks");
	};

	const getAllDBNetworks = async () => {
		fetchData("api/getAllDBNetworks");
	};

	const callBackend = async () => {
		fetchData(query.toUrl());
	};

	return (
		<nav className="flex flex-row justify-between items-center gap-3 bg-gradient-to-b from-black to-gray-800  w-full">
			<h2 className="text-white text-3xl whitespace-nowrap">
				Dependency Inspection
			</h2>
			<Button className="button-48" onClick={() => getAllDBNetworks()}>
				<span className="text">Get Full Network</span>
			</Button>
			{/* <Button className="button-48" onClick={() => getPopularNetwork()}> */}
			{/* <span className="text">getPopularNetwork</span> */}
			{/* </Button> */}
			{/* <PackageJSONUpload></PackageJSONUpload> */}
			<div className="flex flex-col">
				<AddPackage onPackageAdded={addPackage} />
				<div className="flex flex-row w-full gap-1">
					{/* <span className="text-white">URL: '{queryUrl}'</span> */}

					<span className="text-white">
						{query.packages.size > 1 ? "Seed Nodes:" : "Seed Nodes:"}
					</span>
					{Array.from(query.packages).map((name) => (
						<PackageTag name={name} onClose={removePackage} />
					))}
				</div>
			</div>
			<Button onClick={callBackend}>Search</Button>
		</nav>
	);
}

export default Crudbar;
