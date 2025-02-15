// useNodeTable.ts
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Table,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { PackageNode } from "@/utils/models";
import { Signal } from "@preact/signals-react";

export function useNodeTable(tableData: Signal<PackageNode[]>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true,
    inDegree: false,
    outDegree: false,
    dependencies: true,
    dependency_of: true,
    all_dependencies: true,
    all_dependency_of: true,
    closenessCentrality: false,
    eigenvectorCentrality: false,
    clusteringCoefficient: false,
    pagerank: false,
    betweennessCentrality: false,
    isSeed: false,
  });

  const table: Table<PackageNode> = useReactTable<PackageNode>({
    data: tableData.value,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (originalRow) => originalRow.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return {
    table,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
  };
}
