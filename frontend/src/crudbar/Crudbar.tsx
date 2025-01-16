import { Button } from "@/components/ui/button";
import { GraphData } from "@/utils/models";
import { PackageJSONUpload } from "@/components/PackageJSONUpload";
import { fetchGraphData } from "@/crudbar/api";
import QuerySearch from "./QuerySearch";

function Crudbar({ onResponse }: { onResponse: (data: GraphData) => void }) {
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
