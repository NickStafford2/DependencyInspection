"use no memo";
import { columns } from "./columns";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NodeTable } from "./NodeTable";
import { RowFilter } from "./RowFilter";
import { useNodeTable } from "./useNodeTable";
import { useContext } from "react";
import { GlobalStateContext } from "@/context";

/** @useSignals **/
export function NodeTableContainer() {
  const { selectedNodeId } = useContext(GlobalStateContext);
  const { table } = useNodeTable();

  return (
    <div id="node-table-container" className="h-full flex flex-col">
      <div className="flex flex-row items-center py-4 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row flex-nowrap">
            {/* <Button variant="outline" className="ml-auto"> */}
            Columns <ChevronDown />
            {/* </Button> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <RowFilter table={table} />
      </div>
      <NodeTable
        columns={columns}
        table={table}
        scrollTo={selectedNodeId.value}
      />
    </div>
  );
}
