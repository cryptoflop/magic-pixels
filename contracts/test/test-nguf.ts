import { expect } from 'chai'
import { ethers } from 'hardhat'
import { deploy } from '../scripts/deploy_old'
import { full } from '../scripts/full'

describe('Test deployment', function () {
  it('Should deploy', async function () {
    const nguf = await full()
    expect(nguf).not.false
  })
})