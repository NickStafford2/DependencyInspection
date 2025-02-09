import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import { GlobalStateContext } from "@/context";
import { NodeTableContainer } from "@/components/table/NodeTableContainer";
import Messages from "@/components/Messages";

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
          <TabsTrigger className="flex-grow" value="messages">
            Messages
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
        <TabsContent className="p-4" value="messages">
          <Messages />
        </TabsContent>
        <TabsContent className="h-full w-full " value="dependencies">
          <NodeTableContainer />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
