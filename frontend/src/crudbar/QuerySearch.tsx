import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { GraphData } from "@/utils/models";
import { Button } from "@/components/ui/button";
// import { fetchGraphData } from "@/crudbar/api";
import PackageTag from "./PackageTag";
import AddPackage from "./AddPackage";
import { Query } from "@/query";
import { CountContext } from "@/context";

export default function QuerySearch({
  onResponse,
}: {
  onResponse: (data: GraphData) => void;
}) {
  const [query, setQuery] = useState<Query>(new Query());
  const [queryUrl, setQueryUrl] = useState<string>("");
  const [sse, setSse] = useState<EventSource | null>(null);
  const pageload_query_has_run = useRef(false);
  const { messages, currentTab } = useContext(CountContext);

  const addMessage = (newMessage: string) => {
    messages.value = [...messages.value, newMessage];
  };

  const removePackage = (name: string) => {
    query.packages.delete(name);
    setQuery(query);
    setQueryUrl(query.toUrl());
  };

  const addPackage = useCallback(
    (name: string) => {
      if (name !== "") {
        query.packages.add(name);
        setQuery(query);
        setQueryUrl(query.toUrl());
      }
    },
    [query, setQueryUrl, setQuery],
  );

  const startSSEConnection = useCallback(() => {
    messages.value = [];
    currentTab.value = "messages";
    if (!sse) {
      const sseConnection = new EventSource(query.toUrl(), {
        withCredentials: false,
      });
      sseConnection.onmessage = (e) => {
        // console.log("Received data:", e);
        addMessage(e.data);
      };
      sseConnection.addEventListener("network", (e) => {
        const graphData = JSON.parse(e.data);
        onResponse(graphData);
        query.packages.forEach((name: string) => {
          removePackage(name);
        });
        setQuery(new Query());
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
  }, [setSse, onResponse, query, sse]);

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

  return (
    <div className="flex flex-col gap-2 ">
      <h3 className="text-xl">Create a New Query:</h3>
      <div className="flex flex-row gap-2 items-stretch relative">
        {/* <span className="text-white">URL: '{queryUrl}'</span> */}
        <div className="flex flex-col gap-2 grow-0">
          <AddPackage onPackageAdded={addPackage} />
          {query.packages.size ? (
            <div className="flex flex-col gap-3">
              <span className="text-white whitespace-nowrap ">
                {query.packages.size > 1 ? "Seed Nodes:" : "Seed Nodes:"}
              </span>
              <div className="  relative flex flex-row w-64 flex-wrap justify-items-stretch gap-1">
                {Array.from(query.packages).map((name, index) => (
                  <PackageTag
                    className="flex-grow"
                    name={name}
                    onClose={removePackage}
                    key={index}
                  />
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="">
          {/* <Button className="h-full " onClick={callBackend}> */}
          <Button className="" onClick={startSSEConnection}>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
