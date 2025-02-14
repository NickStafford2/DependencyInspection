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
const RowFilter = React.forwardRef<HTMLInputElement, RowFilterProps>(
  ({ className, table, ...props }) => {
    const { selectedNodeId } = useContext(GlobalStateContext);
    const [inputValue, setInputValue] = useState<string>("");
    const ref = useRef<HTMLInputElement>(null);
    const onChange = (event) => {
      setInputValue(event.target.value);
      table.getColumn("id")?.setFilterValue(event.target.value);
    };

    useEffect(() => {
      console.log(ref);
      console.log(selectedNodeId.value);
      // setInputValue(selectedNodeId.value);
      // ref= selectedNodeId.value
      // console.log(table);
      // if (ref.current?.value) {
      //
      // }
      setInputValue(selectedNodeId.value);
      // ref.current?.value = selectedNodeId.value;
      table?.getColumn("id")?.setFilterValue(selectedNodeId.value);
    }, [selectedNodeId.value, table]);
    return (
      <Input
        ref={ref}
        placeholder="Filter packages..."
        onChange={onChange}
        value={inputValue}
        className={cn(className, "max-w-sm mx-2")}
        {...props}
      />
    );
  },
);
export { RowFilter };
