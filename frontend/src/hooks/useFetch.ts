// import { useEffect, useState } from "react";
// import { GraphData } from "../utils/models";
// import axios from "axios";
//
// const useFetchGraphData = (url: string) => {
// 	// const getGraphData = useCallback(() => {
// 	//
// 	// }, [])
// 	// return {getGraphData}
//
// 	const [packageData, setPackageData] = useState<GraphData>();
// 	if (url === null || url === undefined || url === "") return packageData;
// 	// eslint-disable-next-line react-hooks/rules-of-hooks
// 	useEffect(() => {
// 		axios
// 			.get(url)
// 			.then((data) => {
// 				setPackageData(data.data);
// 			})
// 			.catch((error) => {
// 				console.log("Error fetching data", error);
// 			});
// 	}, [url]);
// 	return packageData;
// };
//
// export default useFetchGraphData;
