import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellDependencies } from "./CellDependencies";
import { CellDependenciesRecursive } from "./CellDependenciesRecursive";

const columnHelper = createColumnHelper<Node>();

const formatNumber = (value: number, decimals: number) => {
  return value.toFixed(decimals);
};

export const columns: ColumnDef<Node>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    // If 'id' is not a number, no formatting needed.
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "inDegree",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Direct Dependent of (in degree)
          <ArrowUpDown />
        </Button>
      );
    },
    // 'In Degree' is typically an integer, no decimals needed.
    cell: (info) => formatNumber(info.getValue(), 0),
  },

  {
    accessorKey: "outDegree",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Direct Dependent of (out degree)
          <ArrowUpDown />
        </Button>
      );
    },
    // Assume 'outDegree' is a whole number, no decimal places needed.
    cell: (info) => formatNumber(info.getValue(), 0),
  },
  {
    accessorKey: "dependencyOf",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dependcy Of
          <ArrowUpDown />
        </Button>
      );
    },
    // If 'id' is not a number, no formatting needed.

    cell: (cell) => {
      return (
        <CellDependenciesRecursive cellData={cell}></CellDependenciesRecursive>
      );
    },
  },
  {
    accessorKey: "dependencies",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dependencies
          <ArrowUpDown />
        </Button>
      );
    },
    // If 'id' is not a number, no formatting needed.
    cell: (cell) => {
      return <CellDependencies cellData={cell}></CellDependencies>;
    },
  },
  {
    accessorKey: "allDependencyOf",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          All Dependency Of
          <ArrowUpDown />
        </Button>
      );
    },
    // If 'id' is not a number, no formatting needed.

    cell: (cell) => {
      return <span>test</span>;
    },
  },
  {
    accessorKey: "all_dependencies",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          All Dependencies
          <ArrowUpDown />
        </Button>
      );
    },
    // If 'id' is not a number, no formatting needed.
    cell: (cell) => {
      return <span>test</span>;
    },
  },
  {
    accessorKey: "closenessCentrality",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Closeness Centrality
          <ArrowUpDown />
        </Button>
      );
    },
    // Closeness Centrality can be a value with a few decimal points.
    cell: (info) => formatNumber(info.getValue(), 4),
  },
  {
    accessorKey: "eigenvectorCentrality",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Eigenvector Centrality
          <ArrowUpDown />
        </Button>
      );
    },
    // Eigenvector Centrality typically has several decimal points.
    cell: (info) => formatNumber(info.getValue(), 4),
  },
  {
    accessorKey: "clusteringCoefficient",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clustering Coefficient
          <ArrowUpDown />
        </Button>
      );
    },
    // Clustering Coefficient is often a value between 0 and 1, format with 3 decimals.
    cell: (info) => formatNumber(info.getValue(), 3),
  },
  {
    accessorKey: "pagerank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pagerank
          <ArrowUpDown />
        </Button>
      );
    },
    // Pagerank values often have multiple decimals.
    cell: (info) => formatNumber(info.getValue(), 5),
  },
  {
    accessorKey: "betweennessCentrality",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Betweenness Centrality
          <ArrowUpDown />
        </Button>
      );
    },
    // Betweenness Centrality might have more decimal places.
    cell: (info) => formatNumber(info.getValue(), 4),
  },
  {
    accessorKey: "isSeed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="break-words whitespace-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Is Seed
          <ArrowUpDown />
        </Button>
      );
    },
    // Betweenness Centrality might have more decimal places.
    cell: (info) => {
      const value = info.getValue(); // This gets the boolean value
      return <span>{value ? "Yes" : "No"}</span>; // Render "Yes" for true and "No" for false
    },
  },
];
