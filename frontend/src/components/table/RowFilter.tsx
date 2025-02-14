import { useContext, useEffect, useRef, useState } from "react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlobalStateContext } from "@/context";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

export interface RowFilterProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  table: Table<TData>;
}

/** @useSignals **/
const RowFilter = React.forwardRef<HTMLDivElement, RowFilterProps>(
  ({ className, table, ...props }, ref) => {
    const { selectedNodeId } = useContext(GlobalStateContext);
    const [inputValue, setInputValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const onChange = (event) => {
      setInputValue(event.target.value);
      table.getColumn("id")?.setFilterValue(event.target.value);
    };

    useEffect(() => {
      setInputValue(selectedNodeId.value);
      table?.getColumn("id")?.setFilterValue(selectedNodeId.value);
    }, [selectedNodeId.value, table]);

    const clearClicked = () => {
      setInputValue("");
      selectedNodeId.value = "";
      table?.getColumn("id")?.setFilterValue(selectedNodeId.value);
    };
    return (
      <div
        ref={ref}
        className="flex flex-row w-64
           ring-offset-background file:border-0 rounded-md bg-background  focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
      "
      >
        <Input
          ref={inputRef}
          placeholder="Filter packages..."
          onChange={onChange}
          value={inputValue}
          className={cn(
            className,
            "grow-0  rounded-r-none border-2 border-r-0 focus-visible:ring-0",
          )}
          {...props}
        />
        <button
          className="rounded-l-none px-4 border-2 border-l-0 bg-transparent rounded-r-md hover:bg-white/5 font-bold text-lg text-gray-700"
          onClick={clearClicked}
        >
          x
        </button>
      </div>
    );
  },
);
export { RowFilter };
