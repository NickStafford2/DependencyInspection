import { useMyContext } from "@/context";
import { FaRegTrashAlt, FaTrashAlt } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import * as React from "react";

import { cn } from "@/lib/utils";

const Messages = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { messages, setMessages } = useMyContext();
  const closeMessages = () => {
    setMessages([]);
  };
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <div className="justify-end gap-4 p-4 flex-row flex w-full">
        {messages.length > 0 && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="pr-4 group relative" onClick={closeMessages}>
                  <FaTrashAlt className="absolute opacity-100 group-hover:opacity-0 " />
                  <FaRegTrashAlt className="text-red-600 absolute opacity-0 group-hover:opacity-100  " />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear Messages.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <ol className="list-disc pl-8 flex flex-col gap-1">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ol>
    </div>
  );
});
export default Messages;
