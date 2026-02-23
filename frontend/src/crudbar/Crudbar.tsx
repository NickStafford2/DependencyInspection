import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { GraphData } from "@/utils/models";
// import { PackageJSONUpload } from "@/components/PackageJSONUpload";
// import { useEffect, useState } from "react";
import QuerySearch from "./QuerySearch";
import { useCustomRoutes } from "@/api/useCustomRoutes";
import useQuerySearch2 from "@/api/useQuerySearch2";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function Crudbar() {
  const { getAllDBNetworks } = useCustomRoutes();
  const { startSSEConnection } = useQuerySearch2();
  const [randomCount, setRandomCount] = useState(25);
  return (
    <nav className="px-3 py-2 flex flex-row justify-between items-start gap-3 border-b border-border w-full">
      <div className="flex flex-row flex-shrink flex-grow-0 ">
        <h1 className="text-white text-3xl whitespace-wrap ">
          Dependency Inspection
        </h1>
      </div>
      <QuerySearch />
      <div className="flex flex-col gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Get Full Network</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>This May be Huge.</DialogTitle>
              <DialogDescription>
                This retrieves every node in the Database. Depending on the
                state of development, this may be massive. Be sure you have a
                machine powerful enough.{" "}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className="button-48" onClick={() => getAllDBNetworks()}>
                <span className="text">My Machine can Handle it.</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex flex-row gap-2">
          <Button onClick={() => startSSEConnection(randomCount)}>
            Get Random
          </Button>
          <Input
            className="w-16"
            type="number"
            onChange={(e) => setRandomCount(Number(e.target.value))}
            value={randomCount}
          />
        </div>
      </div>
      {/* <Button className="button-48" onClick={() => getPopularNetwork()}> */}
      {/* <span className="text">getPopularNetwork</span> */}
      {/* </Button> */}
      {/* <PackageJSONUpload></PackageJSONUpload> */}
    </nav>
  );
}

export default Crudbar;
