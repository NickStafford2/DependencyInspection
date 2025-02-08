import React, { createContext } from "react";
import { Signal, signal } from "@preact/signals-react";

interface GlobalState {
  count: Signal<number>;
  currentTab: Signal<string>;
  messages: Signal<string[]>;
}

export const CountContext = createContext<GlobalState | null>(null);

function createAppState(): GlobalState {
  return {
    count: signal(0),
    currentTab: signal("welcome"),
    messages: signal([]),
  };
}

export const CounterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CountContext.Provider value={createAppState()}>
      {children}
    </CountContext.Provider>
  );
};
