import Messages from "@/components/Messages";

export default function GraphMenu() {
  return (
    <div className="relative">
      <div className=" bg-gray-500 absolute top-4 flex flex-col max-w-[20rem] right-4 z-50">
        <Messages></Messages>
      </div>
    </div>
  );
}
