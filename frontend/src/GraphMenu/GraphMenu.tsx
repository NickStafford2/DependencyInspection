import Messages from "@/components/Messages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useContext } from "react";
// import { graphMenuTab } from "@/state";
import { useSignal, useComputed, useSignalEffect } from "@preact/signals-react";
import { CountContext } from "@/context";
// import { useSignals } from "@preact/signals-react/runtime";
// import { graphMenuTab } from "@/state";
// const tab = useSignal(graphMenuTab);
export default function GraphMenu() {
  const state = useContext(CountContext);
  // const count = useSignal(0);
  // const double = useComputed(() => count.value * 2);
  // useSignals();
  // useSignalEffect(() => {
  //   console.log(`Value: ${count.value}, value x 2 = ${double.value}`);
  // });
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const closeMessages = () => {
    setIsVisible(false);
  };
  const onTabChange = (tabName: string) => {
    console.log("tabchange");
    // graphMenuTab.value = tabName;
    // graphMenuTab.value = "info";
  };
  const clicker = () => {
    state.count.value++;
    // if (graphMenuTab.value) {
    //   graphMenuTab."network");
    // }
  };

  return (
    <div className="relative">
      <Card className=" absolute top-4 flex flex-col max-w-[20rem] right-4 z-50">
        {/* <span>Current: {graphMenuTab.value}</span> */}
        <p>Value: {state.count.value}</p>
        <Button onClick={clicker}>Value: {state.count}</Button>
        {/* <Button onClick={clicker}> */}
        {/*   Value: {count}, value x 2 ={double} */}
        {/* </Button> */}
        <Tabs
          defaultValue="info"
          // value={graphMenuTab.value}
          onValueChange={onTabChange}
          className=""
        >
          <TabsList className="w-full justify-around relative">
            {isVisible && (
              <>
                <TabsTrigger value="info">Info</TabsTrigger>
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
              <TabsContent className="p-4" value="info">
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
