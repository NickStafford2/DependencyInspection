import { useMyContext } from "@/context";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaRegTrashAlt, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

export default function Messages() {
  const { messages, setMessages } = useMyContext();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const closeMessages = () => {
    setMessages([]);
    setIsVisible(false);
  };
  return (
    <div className="relative">
      <div className="absolute top-4 flex flex-col max-w-[20rem] right-4 z-50">
        <div className="justify-end gap-4 p-4 flex-row flex w-full">
          {isVisible && messages.length > 0 && (
            <div className="pr-4 group relative" onClick={closeMessages}>
              <FaTrashAlt className="absolute opacity-100 group-hover:opacity-0 " />
              <FaRegTrashAlt className="text-red-600 absolute opacity-0 group-hover:opacity-100  " />
            </div>
          )}
          <button
            className="self-end  hover:text-gray-500"
            onClick={() => setIsVisible(!isVisible)}
          >
            {!isVisible && <MdExpandMore />}
            {isVisible && <MdExpandLess />}
          </button>
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
      </div>
    </div>
  );
}
