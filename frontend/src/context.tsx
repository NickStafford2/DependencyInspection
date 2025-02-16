import { createContext } from "react";
import { Signal } from "@preact/signals-react";
import { GraphData, PackageNode } from "./models/GraphData";
import { NetworkMetadata } from "./models/NetworkMetadata";
import { Analysis } from "./models/Analysis";

export interface GlobalState {
  currentTab: Signal<string>;
  messages: Signal<string[]>;
  showMessages: Signal<boolean>;
  graphData: Signal<GraphData | null>;
  networkMetadata: Signal<NetworkMetadata | null>;
  analysis: Signal<Analysis | null>;
  tableData: Signal<PackageNode[]>;
  selectedNodeId: Signal<string>;
}

export const GlobalStateContext = createContext<GlobalState | null>(null);
