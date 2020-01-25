const FtTokenSale = artifacts.require("./FtTokenSale.sol");

contract("FtTokenSale",(accounts)=>{


	let ftTokenSaleInstance;
	const tokenPrice = 1000000000000000 // in wei (wei is: how we keep track of ether in solidity, so wei is smallest sub-devision of ether, smaalest unit of ether,it mean we don't use float, we use wei) 

	before(async()=>{
		ftTokenSaleInstance = await FtTokenSale.deployed();
	});

	describe("Deployment",async () =>{
		it("Deploy with initial values correctly", async()=>{
			// Has Contract Address
			const cntrctAddress = await ftTokenSaleInstance.address;
			assert.notEqual(cntrctAddress, 0x0, "has contract address");
			assert.notEqual(cntrctAddress, '', "has contract address");
			assert.notEqual(cntrctAddress, null, "has contract address");
			assert.notEqual(cntrctAddress, undefined, "has contract address");
			
			// Has Token Contract Address
			const tokenContractAddress = await ftTokenSaleInstance.tokenContract();
			assert.notEqual(tokenContractAddress, 0x0, "has token contract address");
			assert.notEqual(tokenContractAddress, '', "has token contract address");
			assert.notEqual(tokenContractAddress, null, "has token contract address");
			assert.notEqual(tokenContractAddress, undefined, "has token contract address");

			// Has Token Price
			const price = await ftTokenSaleInstance.tokenPrice();
			assert.equal(price, tokenPrice,"token price is correct");			 
		});
	});
});