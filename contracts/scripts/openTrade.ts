import { openTrade } from "./trade"

export async function ot() {
	await openTrade("0xcf4059A2C60339b2FA0c6d65228BFb13b3Dc66d8")
}

ot().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
