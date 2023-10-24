import { ethers } from 'hardhat'
import { time, impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";
import { forward } from './forward';

export async function gk() {
  const [acc] = await ethers.getSigners()
  const provider = acc.provider!

  const nguf = await ethers.getContractAt('NeverGibUpFrenV1', '0x5207CA53386E1b462316EC9726B9e150de82Bc14')

  const address = "0x7982F3dF4Ef77770CD4EC113bE92C2685c7782E8";
  await impersonateAccount(address);
  const me = await ethers.getSigner(address);

  const whaleAddr = "0x394deecca36dFaca25Db7482FA81744791F2422F";
  await impersonateAccount(whaleAddr);
  const whale = await ethers.getSigner(whaleAddr);

  for (let i = 0; i < 3; i++) {
    await nguf.connect(whale).transfer(acc.address, ethers.utils.parseEther('1000'))
    await forward()
  }

  // if ((await nguf.balanceOf(acc.address)).gt(1)) {
  //   await nguf.connect(acc).transfer(me.address, ethers.utils.parseEther('1000'))
  // } else {
  //   await nguf.connect(me).transfer(acc.address, ethers.utils.parseEther('1000'))
  // }

  // await forward()
  
}

gk().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
