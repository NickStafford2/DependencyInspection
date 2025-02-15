import {
  ColumnDef,
  Column,
  createColumnHelper,
  CellContext,
} from "@tanstack/react-table";

import { CellDependencies } from "./CellDependencies";
// import { CellDependenciesRecursive } from "./CellDependenciesRecursive";
import { PackageNode } from "@/utils/models";
import { NodeTableHeader } from "./NodeTableHeader";

const columnHelper = createColumnHelper<PackageNode>();

const formatNumber = (value: number, decimals: number) => {
  return value.toFixed(decimals);
};

export const columns: ColumnDef<PackageNode>[] = [
  columnHelper.accessor("id", {
    id: "id",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Package" />;
    },
    // If 'id' is not a number, no formatting needed.
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("inDegree", {
    id: "inDegree",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return (
        <NodeTableHeader
          column={column}
          title="Direct Dependent of (in degree)"
        />
      );
    },
    cell: (info) => formatNumber(info.getValue(), 0),
  }),

  columnHelper.accessor("outDegree", {
    id: "outDegree",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return (
        <NodeTableHeader
          column={column}
          title="Direct Dependent of (out degree)"
        />
      );
    },
    cell: (info) => formatNumber(info.getValue(), 0),
  }),
  columnHelper.accessor("dependencies", {
    id: "dependencies",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Dependencies" />;
    },
    cell: (cell: CellContext<PackageNode, string[]>) => {
      // return <CellDependencies cell={cell} />;
      return <span>test</span>;
    },
  }),
  columnHelper.accessor("dependencyOf", {
    id: "dependencyOf",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Dependency Of" />;
    },

    cell: (cell: CellContext<PackageNode, string[]>) => {
      return <CellDependencies cell={cell}></CellDependencies>;
      // return <span>test</span>;
    },
  }),
  columnHelper.accessor("allDependencyOf", {
    id: "allDependencyOf",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="All Dependency Of" />;
    },
    cell: (cell) => {
      return <CellDependencies cell={cell}></CellDependencies>;
      // return <span>test</span>;
    },
  }),
  columnHelper.accessor("allDependencies", {
    id: "all_dependencies",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="All Dependencies" />;
    },
    cell: (cell) => {
      return <CellDependencies cell={cell}></CellDependencies>;
      // return <span>test</span>;
    },
  }),
  columnHelper.accessor("closenessCentrality", {
    id: "closenessCentrality",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Closeness Centrality" />;
    },
    cell: (info) => formatNumber(info.getValue(), 4),
  }),
  {
    accessorKey: "eigenvectorCentrality",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Closeness Centrality" />;
    },
    cell: (info) => formatNumber(info.getValue(), 4),
  },
  {
    accessorKey: "clusteringCoefficient",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Clustering Coefficient" />;
    },
    cell: (info) => formatNumber(info.getValue(), 3),
  },
  {
    accessorKey: "pagerank",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Pagerank" />;
    },
    cell: (info) => formatNumber(info.getValue(), 5),
  },
  {
    accessorKey: "betweennessCentrality",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Betweenness Centrality" />;
    },
    cell: (info) => formatNumber(info.getValue(), 4),
  },
  {
    accessorKey: "isSeed",
    header: ({ column }: { column: Column<PackageNode> }) => {
      return <NodeTableHeader column={column} title="Is Seed" />;
    },
    cell: (info) => {
      const value = info.getValue(); // This gets the boolean value
      return <span>{value ? "Yes" : "No"}</span>; // Render "Yes" for true and "No" for false
    },
  },
];
