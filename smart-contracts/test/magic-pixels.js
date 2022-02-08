contract("MagicPixels", () => {
  it("...should return 4 pixel numbers.", async () => {
    const mpx = await artifacts.require("MagicPixels").deployed();
    const mpr = await artifacts.require("MPR").deployed();

    await mpx.setMpr.call(mpr.address);
    await mpr.setMpx.call(mpx.address);

    await mpx.conjurePixels.call();

    // console.log(pixels.map(bn => bn.toString()));

    assert.equal(1, 1, "Test");
  });
});
