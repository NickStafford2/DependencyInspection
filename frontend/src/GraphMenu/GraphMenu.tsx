import Messages from "@/components/Messages";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { useState } from "react";

/** @useSignals */
export default function GraphMenu() {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <div className="relative">
      <Card className=" absolute items-end top-4 flex flex-col max-w-[20rem] right-4 z-50">
        <div className="flex flex-row justify-between w-full">
          {isVisible && <h2 className="text-2xl pl-8 py-2">Messages</h2>}
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
        </div>
        {isVisible && <Messages />}
      </Card>
    </div>
  );
}
