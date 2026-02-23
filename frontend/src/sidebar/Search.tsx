// import QuerySearch from "@/crudbar/QuerySearch";

/** @useSignals **/
function Search() {
  return (
    <div className="p-4 flex flex-col gap-2">
      <h1 className="text-3xl">Welcome</h1>
      <p>
        Review the dependencies of your npm packages. Query any
        number of packages, and DependencyInspection build a network of all the
        dependencies, their vulnerabilities, and all sorts of network information.
      </p>
      <h1 className="pt-4 text-3xl">Try it out</h1>
      <p>In the search bar at the top of the screen. Type in at least one npm package. Search, and we will dynamically load the entire network of dependencies. </p>
      {/* <QuerySearch /> */}
    </div>
  );
}

export default Search;
