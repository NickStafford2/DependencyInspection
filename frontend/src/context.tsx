import { createContext } from "react";
import { Signal } from "@preact/signals-react";
import { GraphData, Node } from "./utils/models";

export interface GlobalState {
  count: Signal<number>;
  currentTab: Signal<string>;
  messages: Signal<string[]>;
  graphData: Signal<GraphData | null>;
  tableData: Signal<Node[]>;
}

export const GlobalStateContext = createContext<GlobalState | null>(null);
