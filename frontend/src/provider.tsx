import { signal } from "@preact/signals-react";
import { GlobalState, GlobalStateContext } from "./context";

function createAppState(): GlobalState {
  return {
    currentTab: signal("welcome"),
    messages: signal([]),
    graphData: signal(null),
    tableData: signal([]),
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
