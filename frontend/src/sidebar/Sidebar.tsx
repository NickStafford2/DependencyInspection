import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import { GlobalStateContext } from "@/context";
import { NodeTableContainer } from "@/sidebar/table/NodeTableContainer";
import { NetworkMetadata } from "./NetworkMetadata";
import Search from "./Search";
// import QuerySearch from "@/crudbar/QuerySearch";

/** @useSignals **/
export default function Sidebar() {
  const { currentTab } = useContext(GlobalStateContext);
  const onTabChange = (tabName: string) => {
    currentTab.value = tabName;
  };
  return (
    <Card className="h-full ">
      {/* <QuerySearch /> */}
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
          {/* <QuerySearch /> */}
          <Search />
        </TabsContent>
        <TabsContent className="p-4" value="network">
          <NetworkMetadata />
        </TabsContent>
        <TabsContent className="h-full w-full " value="dependencies">
          <NodeTableContainer />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
