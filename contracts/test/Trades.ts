import { expect } from 'chai'

import { viem } from 'hardhat'

import { deployPxls } from '../scripts/MagicPixels'
import { openTrade } from '../scripts/trade'
import { decodeEventLog, parseEther } from 'viem'

describe('Trades', function () {
	let publicClient: Awaited<ReturnType<typeof viem.getPublicClient>>

	let pxlsAddress: `0x${string}`

	before(async function() {
		publicClient = await viem.getPublicClient()
		pxlsAddress = await deployPxls()
	})

	it('Should create a trade', async function () {
		const [acc] = await viem.getWalletClients()
		const trds = await viem.getContractAt('TrdsCore', pxlsAddress)
		
		const [id] = await openTrade(acc, pxlsAddress, "0x0000000000000000000000000000000000000000")
		const trade = await trds.read.getTrade([id])
		
		expect(trade.pixels.length).gt(0)
	})

	it('Should open and close a trade', async function () {
		const [acc1, acc2] = await viem.getWalletClients()
		const trds = await viem.getContractAt('TrdsCore', pxlsAddress)
		
		const [id, pixelBytes] = await openTrade(acc1, pxlsAddress, "0x0000000000000000000000000000000000000000")

		await expect(trds.write.closeTrade([id], { account: acc2.account, value: parseEther("1") }), "Trade price not enforced").to.be.rejected

		const closeTx = await trds.write.closeTrade([id], { account: acc2.account, value: parseEther("1.1") })

		const closeRcpt = await publicClient.waitForTransactionReceipt({ hash: closeTx })
		const tradeClosed = decodeEventLog({ ...closeRcpt.logs[2], abi: trds.abi, eventName: "TradeClosed" })

		expect(tradeClosed.args.trade.pixels.length, "Trade pixel not correct.").gt(0)
		expect(tradeClosed.args.trade.creator.toLowerCase(), "Trade seller not correct.").eq(acc1.account.address)
		expect(closeRcpt.from.toLowerCase(), "Trade buyer not correct.").eq(acc2.account.address)

		const pxls = await viem.getContractAt('PxlsCommon', pxlsAddress)
		const pxlsSeller = await pxls.read.pixelsOf([acc1.account.address, pixelBytes])
		const pxlsBuyer = await pxls.read.pixelsOf([acc2.account.address, pixelBytes])

		expect(pxlsSeller.every(b => b === 0), "seller has more pixels than expected.").to.be.true
		expect(pxlsBuyer.every(b => b > 0), "buyer has fewer pixels than expected.").to.be.true
	})

	it('Should open and close a trade with receiver', async function () {
		const [acc1, acc2, acc3] = await viem.getWalletClients()
		const trds = await viem.getContractAt('TrdsCore', pxlsAddress)
		
		const [id] = await openTrade(acc1, pxlsAddress, acc2.account.address)

		await expect(trds.write.closeTrade([id], { account: acc3.account, value: parseEther("1.1") }), "Trade receiver not enforced").to.be.rejected

		const closeTx = await trds.write.closeTrade([id], { account: acc2.account, value: parseEther("1.1") })
		const closeRcpt = await publicClient.waitForTransactionReceipt({ hash: closeTx })
		const tradeClosed = decodeEventLog({ ...closeRcpt.logs[2], abi: trds.abi, eventName: "TradeClosed" })

		expect(tradeClosed.args.trade.pixels.length, "Trade pixel not correct.").gt(0)
		expect(tradeClosed.args.trade.creator.toLowerCase(), "Trade seller not correct.").eq(acc1.account.address)
		expect(tradeClosed.args.trade.receiver.toLowerCase(), "Trade buyer not correct.").eq(acc2.account.address)
	})
 
	it('Should open and close a buy trade', async function () {
		const publicClient = await viem.getPublicClient()
		const [acc1, acc2] = await viem.getWalletClients()

		const pxls = await viem.getContractAt('PxlsCore', pxlsAddress, { walletClient: acc1 })
		const trds = await viem.getContractAt('TrdsCore', pxlsAddress, { walletClient: acc1 })

		const conjureTx = await pxls.write.conjure([2n], { account: acc2.account, value: parseEther("0.16") })
		const conjureRcpt = await publicClient.waitForTransactionReceipt({ hash: conjureTx })
		const conjured = decodeEventLog({ ...conjureRcpt.logs[0], abi: pxls.abi, eventName: "Conjured" })

		const blncBuyer = await publicClient.getBalance({ address: acc1.account.address })
		const blncSeller = await publicClient.getBalance({ address: acc2.account.address })

		const tradeTx = await trds.write.openTrade([acc2.account.address, conjured.args.pixels, parseEther("1.1"), 1], { value: parseEther("1.1") })
		const tradeRcpt = await publicClient.waitForTransactionReceipt({ hash: tradeTx })
		const tradeOpened = decodeEventLog({ ...tradeRcpt.logs[0], abi: trds.abi, eventName: "TradeOpened" })

		const closeTx = await trds.write.closeTrade([tradeOpened.args.id], { account: acc2.account })
		await publicClient.waitForTransactionReceipt({ hash: closeTx })

		const pxlsC = await viem.getContractAt('PxlsCommon', pxlsAddress)
		const pxlsBuyer = await pxlsC.read.pixelsOf([acc1.account.address, conjured.args.pixels])
		const pxlsSeller = await pxlsC.read.pixelsOf([acc2.account.address, conjured.args.pixels])

		expect(pxlsSeller.every(b => b === 0), "seller has more pixels than expected.").to.be.true
		expect(pxlsBuyer.every(b => b > 0), "buyer has fewer pixels than expected.").to.be.true

		const blncBuyerA = await publicClient.getBalance({ address: acc1.account.address })
		const blncSellerA = await publicClient.getBalance({ address: acc2.account.address })

		expect(blncBuyerA < blncBuyer, "buyer has higher balance than expected.").to.be.true
		expect(blncSellerA > blncSeller, "seller has lower balance than expected.").to.be.true
	})

})