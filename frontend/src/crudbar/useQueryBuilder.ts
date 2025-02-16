import { useState, useCallback } from "react";
import { Query } from "@/query";

export function useQueryBuilder() {
  const [query, setQuery] = useState<Query>(new Query());
  const [searchDisabled, setSearchDisabled] = useState<boolean>(true);

  const removePackage = useCallback(
    (name: string) => {
      query.packages.delete(name);
      setQuery(query);
      if (query.packages.size == 0) setSearchDisabled(true);
    },
    [query],
  );

  const resetQuery = () => {
    setQuery(new Query());
  };

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
  return {
    query,
    searchDisabled,
    addPackage,
    removePackage,
    resetQuery,
  };
}
