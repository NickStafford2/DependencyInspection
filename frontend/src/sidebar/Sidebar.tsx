import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import { GlobalStateContext } from "@/context";
import { NodeTableContainer } from "@/components/table/NodeTableContainer";

export default function Sidebar() {
  const { currentTab } = useContext(GlobalStateContext);
  const onTabChange = (tabName: string) => {
    currentTab.value = tabName;
  };
  return (
    <Card>
      {currentTab.value}
      <Tabs
        defaultValue="welcome"
        value={currentTab.value}
        onValueChange={onTabChange}
        className=""
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
        <TabsContent className="p-4" value="welcome">
          <p>
            Use DependencyInspection to review the dependencies of your npm
            packages. Query any number of packages, and DependencyInspection
            build a network of all the dependencies, their vulnerabilities, and
            all sorts of information.
          </p>
        </TabsContent>

        <TabsContent className="p-4" value="network">
          <p>Network info here</p>
        </TabsContent>
        <TabsContent className="p-4" value="dependencies">
          <NodeTableContainer></NodeTableContainer>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
