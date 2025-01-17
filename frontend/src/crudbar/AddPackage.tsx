import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddPackage({
	onPackageAdded,
}: { onPackageAdded: (name: string) => void }) {
	const [addPackageValue, setAddPackageValue] = useState<string>("");
	const onAddPackageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAddPackageValue(event.target.value);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			onPackageAdded(addPackageValue);
			setAddPackageValue("");
		}
	};
	return (
		<div
			className="flex flex-row 
           ring-offset-background file:border-0 rounded-md bg-background  focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
      "
		>
			<Input
				className="grow-0 w-64 rounded-r-none border-2 border-r-0 focus-visible:ring-0"
				placeholder="Package Search"
				type="text"
				value={addPackageValue}
				onChange={onAddPackageChanged}
				onKeyDown={handleKeyDown}
			></Input>
			<button
				className="rounded-l-none px-4 border-2 border-l-0 bg-transparent rounded-r-md hover:bg-white/5 font-bold text-lg text-green-300"
				onClick={() => onPackageAdded(addPackageValue)}
			>
				+
			</button>
		</div>
	);
}
