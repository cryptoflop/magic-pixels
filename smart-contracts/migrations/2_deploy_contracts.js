module.exports = function(deployer) {
  deployer.deploy(artifacts.require("MagicPixels"));
  deployer.deploy(artifacts.require("MPR"));
};
