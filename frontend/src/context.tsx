import React, { createContext } from "react";
import { Signal, signal } from "@preact/signals-react";
import { GraphData, Node } from "./utils/models";

interface GlobalState {
  count: Signal<number>;
  currentTab: Signal<string>;
  messages: Signal<string[]>;
  graphData: Signal<GraphData | null>;
  tableData: Signal<Node[]>;
}

export const GlobalStateContext = createContext<GlobalState | null>(null);

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
