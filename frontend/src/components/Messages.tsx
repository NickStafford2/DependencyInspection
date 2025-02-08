import { FaRegTrashAlt, FaTrashAlt } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CountContext } from "@/context";
import { useContext } from "react";

const Messages = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { messages, clearMessages } = useContext(CountContext);

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <div className="absolute right-0 top-0 ">
        {messages.value.length > 0 && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="pr-2 top-[-15px] group relative"
                  onClick={clearMessages}
                >
                  <FaTrashAlt className="absolute opacity-100 group-hover:opacity-0 " />
                  <FaRegTrashAlt className="text-red-600 absolute opacity-0 group-hover:opacity-100  " />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear Messages.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <ol className="list-disc pl-8 flex flex-col gap-1">
        {messages.value.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ol>
    </div>
  );
});
export default Messages;
