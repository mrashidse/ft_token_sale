const FtToken = artifacts.require("FtToken");

module.exports = function(deployer) {
	deployer.deploy(FtToken,1000000);
};
