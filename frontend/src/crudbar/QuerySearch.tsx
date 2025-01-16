import { useState } from "react";
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
	return (
		<div className="flex flex-row">
			<div className="flex flex-col gap-2">
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
		</div>
	);
}
