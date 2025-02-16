import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { GraphData } from "@/utils/models";
// import { PackageJSONUpload } from "@/components/PackageJSONUpload";
import { fetchGraphData } from "@/crudbar/api";
// import { useEffect, useState } from "react";
import QuerySearch from "@/crudbar/QuerySearch";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useContext } from "react";
import { GlobalStateContext } from "@/context";

function Search() {
  // const { graphData, tableData } = useContext(GlobalStateContext);
  // const getAllDBNetworks = async () => {
  //   fetchGraphData("api/getAllDBNetworks").then((data) => {
  //     if (data) {
  //       graphData.value = data.graphData;
  //       tableData.value = data.graphData.nodes;
  //     }
  //   });
  // };
  return (
    <div className="p-4 flex flex-col gap-2">
      <h1 className="text-3xl">Welcome. :)</h1>
      <p>
        Use this tool to review the dependencies of your npm packages. Query any
        number of packages, and DependencyInspection build a network of all the
        dependencies, their vulnerabilities, and all sorts of information.
      </p>
      <h1 className="pt-4 text-3xl">Incoming Features</h1>
      <h2 className="ml-4 text-xl">Already working on the backend.</h2>
      <ul className="list-disc ml-8">
        <li>Data Scraping from Github</li>
        <li>Liscense info and threat level.</li>
      </ul>
      <h2 className="text-xl ml-4">Longer Term Goals</h2>
      <ul className="list-disc ml-8">
        <li>Depreciation status</li>
        <li>Rugpull risk assessment</li>
        <li>Current NPM audit status</li>
      </ul>
      {/* <QuerySearch /> */}
    </div>
  );
}

export default Search;
