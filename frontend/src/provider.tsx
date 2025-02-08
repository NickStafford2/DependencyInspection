import { signal } from "@preact/signals-react";
import { GlobalState, GlobalStateContext } from "./context";

function createAppState(): GlobalState {
  return {
    count: signal(0),
    currentTab: signal("welcome"),
    messages: signal([]),
    graphData: signal(null),
    tableData: signal([]),
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
