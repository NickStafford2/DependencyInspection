import React, { createContext } from "react";
import { Signal, signal } from "@preact/signals-react";

interface GlobalState {
  count: Signal<number>;
  messages: Signal<string[]>;
  addMessage: (newMessage: string) => void;
  clearMessages: () => void;
}

export const CountContext = createContext<GlobalState | null>(null);

function createAppState() {
  const count: Signal<number> = signal(0);
  const messages: Signal<string[]> = signal([]);
  const addMessage = (newMessage: string) => {
    messages.value = [...messages.value, newMessage];
  };
  const clearMessages = () => {
    console.log("clearMessages");
    messages.value = [];
  };

  return { count, messages, addMessage, clearMessages };
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
