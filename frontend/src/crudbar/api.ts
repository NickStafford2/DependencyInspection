import { GraphData, isGraphData } from "@/utils/models";

export const fetchGraphData = async (
  url: string,
): Promise<GraphData | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to call ${url}`);
    }

    const data = await response.json();
    if (isGraphData(data)) {
      return data;
    } else {
      console.error("Invalid GraphData format received", data);
      return null;
    }
  } catch (err) {
    console.error("Error fetching graph data:", err);
    return null;
  }
};
