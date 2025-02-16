import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import { GlobalStateContext } from "@/context";
import { NodeTableContainer } from "@/sidebar/table/NodeTableContainer";

export default function Sidebar() {
  const { currentTab } = useContext(GlobalStateContext);
  const onTabChange = (tabName: string) => {
    currentTab.value = tabName;
  };
  return (
    <Card className="h-full ">
      <Tabs
        defaultValue="welcome"
        value={currentTab.value}
        onValueChange={onTabChange}
        className="h-full flex flex-col"
      >
        <TabsList className="w-full flex flex-row justify-around relative">
          <TabsTrigger className="flex-grow" value="welcome">
            Welcome
          </TabsTrigger>
          <TabsTrigger className="flex-grow" value="network">
            Network
          </TabsTrigger>
          <TabsTrigger className="flex-grow" value="dependencies">
            Dependencies
          </TabsTrigger>
        </TabsList>
        <TabsContent value="welcome">
          <div className="p-4 flex flex-col gap-2">
            <h1 className="text-3xl">Welcome. :)</h1>
            <p>
              Use this tool to review the dependencies of your npm packages.
              Query any number of packages, and DependencyInspection build a
              network of all the dependencies, their vulnerabilities, and all
              sorts of information.
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
          </div>
        </TabsContent>

        <TabsContent className="p-4" value="network">
          <p>Network info here</p>
        </TabsContent>
        <TabsContent className="h-full w-full " value="dependencies">
          <NodeTableContainer />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
