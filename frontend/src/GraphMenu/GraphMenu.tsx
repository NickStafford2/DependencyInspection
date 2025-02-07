import Messages from "@/components/Messages";
import { Card } from "@/components/ui/card";

export default function GraphMenu() {
  return (
    <div className="relative">
      <div className=" absolute top-4 flex flex-col max-w-[20rem] right-4 z-50">
        <Card>
          <Messages></Messages>
        </Card>
      </div>
    </div>
  );
}
