const FtToken = artifacts.require("FtToken");
const FtTokenSale = artifacts.require("FtTokenSale");

module.exports = async function(deployer) {
	// Total Supply of Token
	const TOTAL_SUPPLY_OF_TOKEN = 1000000;
	await deployer.deploy(FtToken, TOTAL_SUPPLY_OF_TOKEN);

	// Token Price 0.001 Ether
	const TOKEN_PRICE = 1000000000000000;
	await deployer.deploy(FtTokenSale, FtToken.address, TOKEN_PRICE);
};
