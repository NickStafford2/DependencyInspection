import { createContext } from "react";
import { Signal } from "@preact/signals-react";
import { GraphData, Node } from "./utils/models";

export interface GlobalState {
  currentTab: Signal<string>;
  messages: Signal<string[]>;
  graphData: Signal<GraphData | null>;
  tableData: Signal<Node[]>;
  selectedNodeId: Signal<string>;
}

export const GlobalStateContext = createContext<GlobalState | null>(null);
