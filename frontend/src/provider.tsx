import { signal } from "@preact/signals-react";
import { GlobalState, GlobalStateContext } from "./context";

function createAppState(): GlobalState {
  return {
    currentTab: signal("welcome"),
    messages: signal([]),
    showMessages: signal(false),
    graphData: signal(null),
    tableData: signal([]),
    networkMetadata: signal(null),
    analysis: signal(null),
    selectedNodeId: signal(""),
  };
}

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GlobalStateContext.Provider value={createAppState()}>
      {children}
    </GlobalStateContext.Provider>
  );
};
