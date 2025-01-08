import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

export function CellDependenciesRecursive({ cellData }: { cellData: any }) {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
			<div className="flex items-center justify-between space-x-4 px-4">
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm">
						<h4 className="text-sm font-semibold">
							<span>depends on {cellData.getValue().length} projects</span>
						</h4>
						<ChevronsUpDown className="h-4 w-4" />
					</Button>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent>
				{cellData.getValue().map((item, index) => (
					<div
						key={index}
						className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm whitespace-nowrap"
					>
						{item}
					</div>
				))}
			</CollapsibleContent>
		</Collapsible>
	);
}
