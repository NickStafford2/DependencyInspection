import { useEffect, useRef } from "react";
import useQuerySearch from "./useQuerySearch";

export function useSearchOnPageLoad() {
  const pageload_query_has_run = useRef(false);
  const { addPackage, startSSEConnection } = useQuerySearch();

  useEffect(() => {
    if (!pageload_query_has_run.current) {
      // Function to be executed only the first time
      addPackage("npm");
      startSSEConnection();

      // Mark the flag as true so it won't run again
      pageload_query_has_run.current = true;
    }
  }, [addPackage, startSSEConnection]);
}
