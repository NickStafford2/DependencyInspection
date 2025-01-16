import { IoMdClose } from "react-icons/io";

export default function PackageTag({
	name,
	onClose,
}: { name: string; onClose: (name: string) => void }) {
	return (
		<div className="inline-flex flex-row whitespace-nowrap rounded-md items-center border-black border-1 bg-red-600 text-black font-semibold h-[1.5em]">
			<span className="h-[1.5em] px-2">{name}</span>
			<button
				className="rounded-r-md bg-transparent hover:bg-red-900 "
				onClick={() => onClose(name)}
			>
				<IoMdClose size="1.5em" />
			</button>
		</div>
	);
}
