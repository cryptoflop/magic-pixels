import { expect } from 'chai'

import { viem } from 'hardhat'

import { deployPxls } from '../scripts/MagicPixels'
import { openTrade } from '../scripts/trade'
import { decodeEventLog } from 'viem'

describe('Trades', function () {
	let publicClient: Awaited<ReturnType<typeof viem.getPublicClient>>

	let pxlsAddress: `0x${string}`

	before(async function() {
		publicClient = await viem.getPublicClient()
		pxlsAddress = await deployPxls()
	})

	it('Should create a trade', async function () {
		const [acc] = await viem.getWalletClients()
		const ah = await viem.getContractAt('AuctionHouse', pxlsAddress)
		
		const [id] = await openTrade(acc, pxlsAddress, "0x0000000000000000000000000000000000000000")
		const trade = await ah.read.getTrade([id])
		
		expect(trade.pixels.length).gt(0)
	})

	it('Should open and close a trade', async function () {
		const [acc1, acc2] = await viem.getWalletClients()
		const ah = await viem.getContractAt('AuctionHouse', pxlsAddress)
		
		const [id, pixelBytes] = await openTrade(acc1, pxlsAddress, "0x0000000000000000000000000000000000000000")
		const closeTx = await ah.write.closeTrade([id], { account: acc2.account })

		const closeRcpt = await publicClient.waitForTransactionReceipt({ hash: closeTx })
		const tradeClosed = decodeEventLog({ ...closeRcpt.logs[0], abi: ah.abi, eventName: "TradeClosed" })

		expect(tradeClosed.args.trade.pixels.length, "Trade pixel not correct.").gt(0)
		expect(tradeClosed.args.trade.creator.toLowerCase(), "Trade seller not correct.").eq(acc1.account.address)
		expect(tradeClosed.args.closing.toLowerCase(), "Trade buyer not correct.").eq(acc2.account.address)

		const pxls = await viem.getContractAt('PxlsCommon', pxlsAddress)
		const pxlsSeller = await pxls.read.pixelsOf([acc1.account.address, pixelBytes])
		const pxlsBuyer = await pxls.read.pixelsOf([acc2.account.address, pixelBytes])

		expect(pxlsSeller.every(b => b === 0), "seller has more pixels than expected.").to.be.true
		expect(pxlsBuyer.every(b => b > 0), "buyer has fewer pixels than expected.").to.be.true
	})

	it('Should open and close a trade with receiver', async function () {
		const [acc1, acc2] = await viem.getWalletClients()
		const ah = await viem.getContractAt('AuctionHouse', pxlsAddress)
		
		const [id] = await openTrade(acc1, pxlsAddress, acc2.account.address)

		await expect(ah.write.closeTrade([id], { account: acc1.account }), "dedicated receiver trade didn't fail.").to.be.rejected

		const closeTx = await ah.write.closeTrade([id], { account: acc2.account })
		const closeRcpt = await publicClient.waitForTransactionReceipt({ hash: closeTx })
		const tradeClosed = decodeEventLog({ ...closeRcpt.logs[0], abi: ah.abi, eventName: "TradeClosed" })

		expect(tradeClosed.args.trade.pixels.length, "Trade pixel not correct.").gt(0)
		expect(tradeClosed.args.trade.creator.toLowerCase(), "Trade seller not correct.").eq(acc1.account.address)
		expect(tradeClosed.args.trade.receiver.toLowerCase(), "Trade buyer not correct.").eq(acc2.account.address)
	})

	// TODO: buy trade

})