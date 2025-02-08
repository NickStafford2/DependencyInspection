import Messages from "@/components/Messages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { useState, useContext } from "react";
import { CountContext } from "@/context";

/** @useSignals */
export default function GraphMenu() {
  const { currentTab } = useContext(CountContext);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const onTabChange = (tabName: string) => {
    currentTab.value = tabName;
  };
  const clicker = () => {
    if (currentTab.value == "welcome") {
      currentTab.value = "network";
    } else {
      currentTab.value = "welcome";
    }
  };

  return (
    <div className="relative">
      <Card className=" absolute top-4 flex flex-col max-w-[20rem] right-4 z-50">
        <Tabs
          defaultValue="welcome"
          value={currentTab.value}
          onValueChange={onTabChange}
          className=""
        >
          <TabsList className="w-full justify-around relative">
            {isVisible && (
              <>
                <TabsTrigger onSelect={clicker} value="welcome">
                  Welcome
                </TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
              </>
            )}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-3 text-card-background"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {!isVisible && <MdExpandMore />}
                    {isVisible && <MdExpandLess />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!isVisible && "Show Messages"}
                    {isVisible && "Hide Messages"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsList>

          {isVisible && (
            <>
              <TabsContent className="p-4" value="welcome">
                <p>
                  Use DependencyInspection to review the dependencies of your
                  npm packages. Query any number of packages, and
                  DependencyInspection build a network of all the dependencies,
                  their vulnerabilities, and all sorts of information.
                </p>
              </TabsContent>

              <TabsContent className="p-4" value="network">
                <p>Network info here</p>
              </TabsContent>
              <TabsContent className="p-4" value="messages">
                <Messages />
              </TabsContent>
            </>
          )}
        </Tabs>
      </Card>
    </div>
  );
}
