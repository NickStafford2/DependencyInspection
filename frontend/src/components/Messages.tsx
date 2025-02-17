import { FaRegTrashAlt, FaTrashAlt } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import * as React from "react";

import { cn } from "@/lib/utils";
import { GlobalStateContext } from "@/context";
import { useContext, useRef, useEffect } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

/** @useSignals */
const Messages = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { messages } = useContext(GlobalStateContext);

  const clearMessages = () => {
    messages.value = [];
  };

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {messages.value.length > 0 && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="group flex float-right justify-center items-center w-8 h-8 "
                onClick={clearMessages}
              >
                <FaTrashAlt className="absolute opacity-100 group-hover:opacity-0" />
                <FaRegTrashAlt className="absolute opacity-0 group-hover:opacity-100" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Messages.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <ol className="list-disc pl-8 flex flex-col-reverse overflow-auto max-h-[34rem] gap-1  scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-500 scrollbar-track-gray-100">
        {messages.value.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ol>
    </div>
  );
});
export default Messages;
