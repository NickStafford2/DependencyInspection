import { useState, useEffect, useCallback } from "react";
import { GraphData } from "@/models/GraphData";
import { NetworkMetadata } from "@/models/NetworkMetadata";

export function useSSEConnection2(
  url: string,
  onConnectionStart: () => void,
  onNetworkData: (graphData: GraphData) => void,
  onNetworkMetadata: (networkMetadata: NetworkMetadata) => void,
  onMessage: (message: string) => void,
) {
  const [sse, setSse] = useState<EventSource | null>(null);

  const setupSSEConnection = useCallback(() => {
    if (!sse) {
      const sseConnection = new EventSource(url, {
        withCredentials: false,
      });
      sseConnection.onmessage = (e) => {
        onMessage(e.data);
      };

      sseConnection.addEventListener("networkMetadata", (e) => {
        onNetworkMetadata(JSON.parse(e.data));
      });
      // sseConnection.addEventListener("analysis", (e) => {
      //   console.log(e);
      //   console.log(JSON.parse(e.data));
      // });
      sseConnection.addEventListener("network", (e) => {
        onNetworkData(JSON.parse(e.data));
      });
      sseConnection.onerror = (e) => {
        console.error("SSE error:", e);
        sseConnection.close();
        setSse(null);
      };
      sseConnection.onopen = (e) => {
        console.log("SSE open ", e);
      };
      setSse(sseConnection);
    }
  }, [url, onMessage, onNetworkMetadata, onNetworkData, setSse, sse]);

  const startSSEConnection = useCallback(() => {
    if (!sse) {
      onConnectionStart();
      setupSSEConnection();
    }
  }, [onConnectionStart, setupSSEConnection, sse]);

  useEffect(() => {
    return () => {
      if (sse) {
        sse.close();
      }
    };
  }, [sse]);
  return {
    startSSEConnection,
  };
}
