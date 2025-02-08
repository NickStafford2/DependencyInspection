import React, { createContext } from "react";
import { Signal, signal } from "@preact/signals-react";

interface GlobalState {
  count: Signal<number>;
  messages: Signal<string[]>;
  addMessage: (newMessage: string) => void;
}

export const CountContext = createContext<GlobalState | null>(null);
// export const CountContext = createContext(signal(0));

function createAppState() {
  const count: Signal<number> = signal(0);
  const messages: Signal<string[]> = signal([]);
  const addMessage = (newMessage: string) => {
    messages.value = [...messages.value, newMessage];
  };

  return { count, messages, addMessage };
}

export const CounterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const state: GlobalState = { count, messages };
  return (
    <CountContext.Provider value={createAppState()}>
      {children}
    </CountContext.Provider>
  );
};
