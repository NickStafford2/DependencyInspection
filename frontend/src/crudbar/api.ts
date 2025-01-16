import { GraphData, isGraphData } from "@/utils/models";

export const fetchGraphData = async (
	url: string,
): Promise<GraphData | null> => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			const message = `Failed to call ${url}`;
			// setResponseMessage(message);
			throw new Error(message);
		}
		const data = await response.json();
		if (isGraphData(data)) {
			return data;
		}
		// setResponseMessage(data);
	} catch (err) {
		console.error(err);
	}
	return null;
};
