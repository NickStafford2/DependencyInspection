import { IoMdClose } from "react-icons/io";
import { cn } from "@/lib/utils";
import React from "react";

interface Props extends React.LiHTMLAttributes<HTMLLIElement> {
	name: string;
	onClose: (name: string) => void;
}

const PackageTag = React.forwardRef<HTMLDivElement, Props>(
	({ name, onClose, className }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"inline-flex flex-row justify-between whitespace-nowrap rounded-md items-center border border-gray-500 text-text font-semibold h-[1.5em]",
					className,
				)}
			>
				<span className="h-[1.5em] px-2">{name}</span>
				<button
					className="rounded-r-md bg-transparent hover:text-red-600 "
					onClick={() => onClose(name)}
				>
					<IoMdClose size="1.5em" />
				</button>
			</div>
		);
	},
);
export default PackageTag;
