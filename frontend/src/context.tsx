import { createContext } from "react";
import { Signal } from "@preact/signals-react";
import { GraphData, PackageNode } from "./models/GraphData";

export interface GlobalState {
  currentTab: Signal<string>;
  messages: Signal<string[]>;
  showMessages: Signal<boolean>;
  graphData: Signal<GraphData | null>;
  tableData: Signal<PackageNode[]>;
  selectedNodeId: Signal<string>;
}

export const GlobalStateContext = createContext<GlobalState | null>(null);
