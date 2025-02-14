import { columns } from "./columns";
import {
  getFilteredRowModel,
  getCoreRowModel,
  VisibilityState,
  ColumnFiltersState,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Table,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NodeTable } from "./NodeTable";
import React, { useContext } from "react";
import { GlobalStateContext } from "@/context";
import { RowFilter } from "./RowFilter";
import { PackageNode } from "@/utils/models";

/** @useSignals **/
export function NodeTableContainer() {
  const { tableData, selectedNodeId } = useContext(GlobalStateContext);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      inDegree: false,
      outDegree: false,
      dependencies: false,
      dependency_of: false,
      all_dependencies: false,
      all_dependency_of: false,
      closenessCentrality: false,
      eigenvectorCentrality: false,
      clusteringCoefficient: true,
      pagerank: true,
      betweennessCentrality: true,
      isSeed: false,
    });

  const table: Table<PackageNode> = useReactTable<PackageNode>({
    data: tableData.value,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (originalRow) => {
      return originalRow.id;
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });
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
      ></NodeTable>
    </div>
  );
}
