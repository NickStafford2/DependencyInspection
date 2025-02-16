import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Query } from "@/query";
import { GlobalStateContext } from "@/context";

export function useQuerySearch() {
  const [query, setQuery] = useState<Query>(new Query());
  const [searchDisabled, setSearchDisabled] = useState<boolean>(true);
  const [sse, setSse] = useState<EventSource | null>(null);
  const pageload_query_has_run = useRef(false);
  const {
    messages,
    currentTab,
    showMessages,
    graphData,
    networkMetadata,
    tableData,
  } = useContext(GlobalStateContext);

  const addMessage = useCallback(
    (newMessage: string) => {
      messages.value = [...messages.value, newMessage];
    },
    [messages],
  );

  const removePackage = useCallback(
    (name: string) => {
      query.packages.delete(name);
      setQuery(query);
      if (query.packages.size == 0) setSearchDisabled(true);
    },
    [query],
  );

  const addPackage = useCallback(
    (name: string) => {
      if (name !== "") {
        query.packages.add(name);
        setQuery(query);
        if (searchDisabled) setSearchDisabled(false);
      }
    },
    [query, searchDisabled],
  );

  const startSSEConnection = useCallback(() => {
    messages.value = [];
    currentTab.value = "messages";
    showMessages.value = true;
    if (!sse) {
      const sseConnection = new EventSource(query.toUrl(), {
        withCredentials: false,
      });
      sseConnection.onmessage = (e) => {
        addMessage(e.data);
      };

      sseConnection.addEventListener("networkMetadata", (e) => {
        networkMetadata.value = JSON.parse(e.data);
      });
      // sseConnection.addEventListener("analysis", (e) => {
      //   console.log(e);
      //   console.log(JSON.parse(e.data));
      // });
      sseConnection.addEventListener("network", (e) => {
        graphData.value = JSON.parse(e.data);
        tableData.value = graphData.value.nodes;
        // console.log(graphData.value);
        query.packages.forEach((name: string) => {
          removePackage(name);
        });
        setQuery(new Query());
        setTimeout(() => {
          // currentTab.value = "network";
          currentTab.value = "dependencies"; // todo: change to packages
        }, 500);
        setTimeout(() => {
          showMessages.value = false;
        }, 1500);
      });
      sseConnection.onerror = (e) => {
        console.error("SSE error:", e);
        sseConnection.close();
        setSse(null);
        // console.log(messages);
      };
      sseConnection.onopen = (e) => {
        console.log("SSE open ", e);
      };
      setSse(sseConnection);
    }
  }, [
    setSse,
    networkMetadata,
    query,
    sse,
    showMessages,
    currentTab,
    addMessage,
    graphData,
    messages,
    removePackage,
    tableData,
  ]);

  useEffect(() => {
    return () => {
      if (sse) {
        sse.close();
      }
    };
  }, [sse]);

  useEffect(() => {
    if (!pageload_query_has_run.current) {
      // Function to be executed only the first time
      addPackage("npm");
      startSSEConnection();

      // Mark the flag as true so it won't run again
      pageload_query_has_run.current = true;
    }
  }, [addPackage, startSSEConnection]);

  return {
    query,
    searchDisabled,
    addPackage,
    removePackage,
    startSSEConnection,
  };
}
