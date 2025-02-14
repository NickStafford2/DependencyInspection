import { useContext, useEffect, useRef, useState } from "react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlobalStateContext } from "@/context";
import { Table } from "@tanstack/react-table";
import { PackageNode } from "@/utils/models";

export interface RowFilterProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  table: Table<PackageNode>;
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
        className="flex flex-row w-64 ring-offset-background file:border-0   border-2 focus-visible:ring-0 rounded-md bg-background  focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      >
        <input
          ref={inputRef}
          placeholder="Filter packages..."
          onChange={onChange}
          value={inputValue}
          className={cn(
            className,
            "bg-background flex h-10 w-full rounded-md  px-3 py-2 text-base placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-0",
          )}
          {...props}
        />
        {inputValue.length === 0 || (
          <button
            className="px-4 bg-transparent rounded-r-md hover:bg-white/5 hover:text-red-400 font-bold text-md text-gray-700"
            onClick={clearClicked}
          >
            x
          </button>
        )}
      </div>
    );
  },
);
export { RowFilter };
