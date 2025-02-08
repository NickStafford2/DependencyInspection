import React, { createContext, useState, useContext } from "react";
import { Signal, signal } from "@preact/signals-react";

// Create the context
const MyContext = createContext();

// Create a provider component
export const MyContextProvider = ({ children }) => {
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <MyContext.Provider value={{ messages, setMessages }}>
      {children}
    </MyContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useMyContext = () => useContext(MyContext);
//
//
//
//
interface GlobalState {
  count: Signal<number>;
  messages: Signal<string[]>;
}

export const CountContext = createContext<GlobalState | null>(null);
// export const CountContext = createContext(signal(0));

function createAppState() {
  const count: Signal<number> = signal(0);
  const messages: Signal<string[]> = signal([]);

  return { count, messages };
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
