import { fetchGraphData } from "@/api/api";
import { GlobalStateContext } from "@/context";
import { useContext } from "react";

export function useCustomRoutes() {
  const { graphData, tableData } = useContext(GlobalStateContext);
  const getAllDBNetworks = async () => {
    fetchGraphData("api/getAllDBNetworks").then((data) => {
      if (data) {
        graphData.value = data;
        tableData.value = data.nodes;
      }
    });
  };
  const getPopularNetworks = async () => {
    fetchGraphData("api/getPopularNetworks").then((data) => {
      if (data) {
        graphData.value = data;
        tableData.value = data.nodes;
      }
    });
  };
  return { getAllDBNetworks, getPopularNetworks };
}
