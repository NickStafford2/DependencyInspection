import { Button } from "@/components/ui/button";
import PackageTag from "./PackageTag";
import AddPackage from "./AddPackage";
import useQuerySearch from "./useQuerySearch";

export default function QuerySearch() {
  const {
    query,
    addPackage,
    removePackage,
    startSSEConnection,
    searchDisabled,
  } = useQuerySearch();

  return (
    <div className="flex flex-col gap-2 ">
      <h3 className="text-xl">Create a New Query:</h3>
      <div className="flex flex-row gap-2 items-stretch relative">
        {/* <span className="text-white">URL: '{queryUrl}'</span> */}
        <div className="flex flex-col gap-2 grow-0">
          <AddPackage onPackageAdded={addPackage} />
          {query.packages.size ? (
            <div className="flex flex-col gap-3">
              <span className="text-white whitespace-nowrap ">
                {query.packages.size > 1 ? "Seed Nodes:" : "Seed Nodes:"}
              </span>
              <div className="  relative flex flex-row w-64 flex-wrap justify-items-stretch gap-1">
                {Array.from(query.packages).map((name, index) => (
                  <PackageTag
                    className="flex-grow"
                    name={name}
                    onClose={removePackage}
                    key={index}
                  />
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="">
          {/* <Button className="h-full " onClick={callBackend}> */}
          <Button
            className=""
            disabled={searchDisabled}
            onClick={startSSEConnection}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
