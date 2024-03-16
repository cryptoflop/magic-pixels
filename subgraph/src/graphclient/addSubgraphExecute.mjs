import { readFileSync, appendFileSync } from "fs";

/** 
	This adds a proxy function for the graphclient execute function
	replacing a chain name with the corresponding subgraph id 
**/

appendFileSync("./.graphclient/index.ts", `

const subgraphMap: Record<string, string> = ${readFileSync("./subgraph-ids.json").toString()};
	
export const subgraphExecute: ExecuteMeshFn = (...args) => {
	args[2] = { subgraph: subgraphMap[args[2]] };
	return execute(...args)
};
`);
