import { EventLog } from 'ethers'
import { ethers } from 'hardhat'

export async function openTrade(pxlsAddress: string) {
	const [_, acc] = await ethers.getSigners()

	const pxls = await ethers.getContractAt('IMagicPixels', pxlsAddress, acc)
	const ah = await ethers.getContractAt('AuctionHouse', pxlsAddress, acc)

	const c = await pxls.conjure(2, { value: ethers.parseEther("0.05") })
	await c.wait()

	const pixels = (await pxls.pixelsOf(acc.address)).map(r => r.map(b => b))

	const tx = await ah.openTrade("0x0000000000000000000000000000000000000000", pixels, 0, true)
	const rc = await tx.wait()
	const tradeId = (rc!.logs[0] as EventLog).args[1]
  console.log("TradeId: " + tradeId)
	return tradeId
}