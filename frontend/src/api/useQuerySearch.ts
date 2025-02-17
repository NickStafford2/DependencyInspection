import { useSSEConnection } from "./useSSEConnection";
import { GraphData } from "@/models/GraphData";
import { GlobalStateContext } from "@/context";
import { useCallback, useContext } from "react";
import { useQueryBuilder } from "./useQueryBuilder";
import { NetworkMetadata } from "@/models/NetworkMetadata";

export default function useQuerySearch() {
  const {
    messages,
    networkMetadata,
    graphData,
    tableData,
    currentTab,
    showMessages,
  } = useContext(GlobalStateContext);
  const { query, searchDisabled, addPackage, removePackage } =
    useQueryBuilder();

  const addMessage = useCallback(
    (newMessage: string) => {
      console.log(`addMessage: ${newMessage}`);
      console.log(messages.value);
      messages.value = [...messages.value, newMessage];
      console.log(messages.value);
    },
    [messages],
  );

  const onConnectionStart = () => {
    messages.value = [];
    currentTab.value = "messages";
    showMessages.value = true;
  };
  const handleMessage = (message: string) => {
    addMessage(message);
    // messages.value = [];
    currentTab.value = "messages";
    showMessages.value = true;
  };
  const handleGraphMetadata = (nmd: NetworkMetadata) => {
    networkMetadata.value = nmd;
  };
  const handleGraphData = (gd: GraphData) => {
    graphData.value = gd;
    tableData.value = graphData.value.nodes;
    // console.log(graphData.value);
    query.packages.forEach((name: string) => {
      removePackage(name);
    });
    // resetQuery();
    setTimeout(() => {
      // currentTab.value = "network";
      currentTab.value = "dependencies"; // todo: change to packages
    }, 500);
    setTimeout(() => {
      showMessages.value = false;
    }, 1500);
  };

  const { startSSEConnection } = useSSEConnection(
    query,
    onConnectionStart,
    handleGraphData,
    handleGraphMetadata,
    handleMessage,
  );

  return {
    query,
    addPackage,
    removePackage,
    startSSEConnection,
    searchDisabled,
  };
}
