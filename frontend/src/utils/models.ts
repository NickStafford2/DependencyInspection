export class GraphData {
	directed: boolean;
	graph: object;
	links: Array<{ source: string; target: string }>;
	multigraph: boolean;
	nodes: Array<{ id: string }>;
	analytics?: object;

	constructor(
		directed: boolean,
		graph: object,
		links: Array<{ source: string; target: string }>,
		multigraph: boolean,
		nodes: Array<{ id: string }>,
		analytics?: object,
	) {
		this.directed = directed;
		this.graph = graph;
		this.links = links;
		this.multigraph = multigraph;
		this.nodes = nodes;
		this.analytics = analytics;
	}
}

const _isObject = (value: unknown): value is object =>
	typeof value === "object" && value !== null;
const _isString = (value: unknown): value is string =>
	typeof value === "string";
const _isArray = <T>(
	value: unknown,
	checkItem: (item: unknown) => item is T,
): value is T[] => {
	return Array.isArray(value) && value.every(checkItem);
};

const _isLink = (link: unknown): link is { source: string; target: string } => {
	return (
		_isObject(link) &&
		_isString((link as { source: unknown }).source) &&
		_isString((link as { target: unknown }).target)
	);
};

const _isNode = (node: unknown): node is { id: string } => {
	return _isObject(node) && _isString((node as { id: unknown }).id);
};

export const isGraphData = (data: unknown): data is GraphData => {
	if (!_isObject(data)) {
		console.error("Data is not an object");
		return false;
	}

	const obj = data as { [key: string]: unknown };

	// Validate directed
	if (typeof obj.directed !== "boolean") {
		console.error("Invalid type for directed: expected boolean");
		return false;
	}

	// Validate graph
	if (!_isObject(obj.graph)) {
		console.error("Invalid type for graph: expected object");
		return false;
	}

	// Validate links
	if (!_isArray(obj.links, _isLink)) {
		console.error(
			"Invalid links format: expected an array of objects with source and target strings",
		);
		return false;
	}

	if (typeof obj.multigraph !== "boolean") {
		console.error("Invalid type for multigraph: expected boolean");
		return false;
	}

	// Validate nodes
	if (!_isArray(obj.nodes, _isNode)) {
		console.error(
			"Invalid nodes format: expected an array of objects with id as string",
		);
		return false;
	}

	// Validate analytics
	if (obj.analytics !== undefined && !_isObject(obj.analytics)) {
		console.error("Invalid type for analytics: expected object or undefined");
		return false;
	}

	// All checks passed
	return true;
};
