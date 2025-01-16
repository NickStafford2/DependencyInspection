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
	return (
		<div className="flex flex-row">
			<Button
				className="rounded-r-none border-2 border-r-0"
				onClick={() => onPackageAdded(addPackageValue)}
			>
				Add Package:
			</Button>
			<Input
				className="grow-0 w-64 rounded-l-none border-2 border-l-0"
				type="text"
				value={addPackageValue}
				onChange={onAddPackageChanged}
			></Input>
		</div>
	);
}
