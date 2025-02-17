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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useCustomRoutes } from "@/api/useCustomRoutes";
import useQuerySearch2 from "@/api/useQuerySearch2";

function Crudbar() {
  const { getAllDBNetworks } = useCustomRoutes();
  const { startSSEConnection } = useQuerySearch2();
  return (
    <nav className="px-3 py-2 flex flex-row justify-between items-start gap-3 bg-gradient-to-b from-black to-gray-800  w-full">
      <div className="flex flex-row flex-shrink flex-grow-0 ">
        <h1 className="text-white text-3xl whitespace-nowrap ">
          Dependency Inspection
        </h1>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">
              <h2 className="text-red-600 text-4xl font-bold rotate-[-15deg]">
                BETA
              </h2>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="w-100 max-w-100">
              <h3 className="text-red-600 text-2xl font-semibold w-30 max-w-30">
                Ongoing Development.
              </h3>
              <p className="py-2">
                Most of the impressive stuff is on the backend. I am currently
                working on the frontend to show all the incredible data I
                already have on the backend.{" "}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <QuerySearch />
      <div className="flex flex-col gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Get Full Network</Button>
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
        <Button onClick={() => startSSEConnection()}>Get Random</Button>
      </div>
      {/* <Button className="button-48" onClick={() => getPopularNetwork()}> */}
      {/* <span className="text">getPopularNetwork</span> */}
      {/* </Button> */}
      {/* <PackageJSONUpload></PackageJSONUpload> */}
    </nav>
  );
}

export default Crudbar;
