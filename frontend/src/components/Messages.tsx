import { useMyContext } from "@/context";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaRegTrashAlt, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Messages() {
  const { messages, setMessages } = useMyContext();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const closeMessages = () => {
    setMessages([]);
    setIsVisible(false);
  };
  return (
    <>
      <div className="justify-end gap-4 p-4 flex-row flex w-full">
        {isVisible && messages.length > 0 && (
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
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="self-end  hover:text-gray-500"
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

      {isVisible && (
        <>
          <ol className="list-disc flex flex-col gap-1">
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}
