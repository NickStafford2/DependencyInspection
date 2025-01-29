import { useMyContext } from "@/context";

export default function Messages() {
	const { messages, setMessages } = useMyContext();
	return (
		<div className="relative">
			<div className="absolute top-4 right-4 z-50">
				{messages.map((message, index) => (
					<p key={index}>{message}</p>
				))}
			</div>
		</div>
	);
}
