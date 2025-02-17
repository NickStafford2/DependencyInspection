import { useSSEConnection2 } from "./useSSEConnection2";
import { GraphData } from "@/models/GraphData";
import { GlobalStateContext } from "@/context";
import { useCallback, useContext } from "react";
import { NetworkMetadata } from "@/models/NetworkMetadata";

export default function useQuerySearch2() {
  const {
    messages,
    networkMetadata,
    graphData,
    tableData,
    currentTab,
    showMessages,
  } = useContext(GlobalStateContext);

  const addMessage = useCallback(
    (newMessage: string) => {
      messages.value = [...messages.value, newMessage];
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
    setTimeout(() => {
      // currentTab.value = "network";
      currentTab.value = "dependencies"; // todo: change to packages
    }, 500);
    setTimeout(() => {
      showMessages.value = false;
    }, 1500);
  };

  const { startSSEConnection } = useSSEConnection2(
    "api/getPopularNetworks",
    onConnectionStart,
    handleGraphData,
    handleGraphMetadata,
    handleMessage,
  );

  return {
    startSSEConnection,
  };
}
