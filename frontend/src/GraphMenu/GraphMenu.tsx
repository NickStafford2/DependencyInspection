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
import { useState } from "react";

export default function GraphMenu() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const closeMessages = () => {
    setIsVisible(false);
  };
  return (
    <div className="relative">
      <Card className=" absolute top-4 flex flex-col max-w-[20rem] right-4 z-50">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="self-end rounded-bl-lg border-l border-b p-4 text-card-foreground shadow-sm"
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
        {isVisible && (
          <Tabs defaultValue="info" className="">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="Messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <p>
                Use DependencyInspection to review the dependencies of your npm
                packages. Query any number of packages, and DependencyInspection
                build a network of all the dependencies, their vulnerabilities,
                and all sorts of information.
              </p>
            </TabsContent>
            <TabsContent value="Messages">
              <Messages />
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  );
}
