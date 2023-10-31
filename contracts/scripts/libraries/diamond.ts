import { type Abi, type Hex, getFunctionSelector } from "viem"

export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 }

// get function selectors from ABI
export function getSelectors(abi: Abi) {
  return abi.reduce((acc, f) => {
		if (f.type === "function" && f.name !== "init") {
			acc.push(getFunctionSelector(f))
    }
    return acc
  }, [] as Hex[])
}