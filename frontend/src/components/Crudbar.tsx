import { useState } from "react";
import { Query } from "@/query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GraphData, isGraphData } from "@/utils/models";
import { PackageJSONUpload } from "./PackageJSONUpload";

function Crudbar({ onResponse }: { onResponse: (data: GraphData) => void }) {
  const [query, setQuery] = useState<Query>(new Query());
  const [queryUrl, setQueryUrl] = useState<string>("");
  const [addPackageValue, setAddPackageValue] = useState<string>("");

  const onAddPackageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddPackageValue(event.target.value);
  };
  const addPackage = () => {
    console.log("add Package");
    // const oldQuery = query;
    query.packages.add(addPackageValue);
    setQuery(query);
    setQueryUrl(query.toUrl());
    console.log(query);
  };

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const message = `Failed to call ${url}`;
        // setResponseMessage(message);
        throw new Error(message);
      }
      const data = await response.json();
      if (isGraphData(data)) {
        onResponse(data);
      }
      // setResponseMessage(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getPopularNetwork = async () => {
    fetchData("api/getPopularNetworks");
  };

  const getAllDBNetworks = async () => {
    fetchData("api/getAllDBNetworks");
  };

  const callBackend = async () => {
    fetchData(query.toUrl());
  };

  return (
    <nav className="flex  flex-col bg-gradient-to-b from-black to-gray-800  w-full">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-white text-3xl">NPM Visual</h2>
        <Button className="button-48" onClick={() => getAllDBNetworks()}>
          <span className="text">getAllDBNetworks</span>
        </Button>
        <Button className="button-48" onClick={() => getPopularNetwork()}>
          <span className="text">getPopularNetwork</span>
        </Button>
        <PackageJSONUpload></PackageJSONUpload>
        <div className="flex flex-row">
          <Button
            className="rounded-r-none border-2 border-r-0"
            onClick={addPackage}
          >
            Add Package:
          </Button>
          <Input
            className="grow-0 w-64 rounded-l-none border-2 border-l-0"
            type="text"
            value={addPackageValue}
            onChange={onAddPackageChanged}
          ></Input>
        </div>
        <Button onClick={callBackend}>Call Backend</Button>
      </div>
      <span className="text-white">URL: '{queryUrl}'</span>
    </nav>
  );
}

export default Crudbar;
