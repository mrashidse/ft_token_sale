const FtToken = artifacts.require("./FtToken.sol");
const FtTokenSale = artifacts.require("./FtTokenSale.sol");

contract("FtTokenSale",(accounts)=>{

	const ADMIN = accounts[0];
	const BUYER = accounts[1];
	const TOKEN_PRICE = 1000000000000000; // in wei (wei is: how we keep track of ether in solidity, so wei is smallest sub-devision of ether, smaalest unit of ether,it mean we don't use float, we use wei) 
	const TOKENS_AVAILABLE = 750000;


	let ftTokenInstance;
	let ftTokenSaleInstance;

	before(async()=>{
		ftTokenInstance = await FtToken.deployed();
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
			assert.equal(price, TOKEN_PRICE,"token price is correct");			 
		});
	});
	
	describe("Token Buying",async () =>{
		var numberOfTokens = 10;
		var value = numberOfTokens * TOKEN_PRICE;
		
		it("Provisions % of all Tokens to the Token Sale", async()=>{
			const receipt = await ftTokenInstance.transfer(ftTokenSaleInstance.address, TOKENS_AVAILABLE, {from: ADMIN});
		});

		it("Emit sell event on buying", async()=>{
			const receipt = await ftTokenSaleInstance.buyTokens(numberOfTokens, {from: BUYER, value: value});
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
			assert.equal(receipt.logs[0].args._buyer, BUYER, 'logs the account that purchases the tokens');
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the numberOfTokens purchased');
			console.log(receipt.logs[0].args._amount.toNumber());
		});

		it("Increments tokensSold", async()=>{
			const amount = await ftTokenSaleInstance.tokensSold();
			assert.equal(amount.toNumber(), numberOfTokens, "increments the number of tokens sold")

		});

		it("Buyer balance", async()=>{
			const balance = await ftTokenInstance.balanceOf(BUYER);
			assert.equal(balance.toNumber(), numberOfTokens, "buyer balance")
		});

		it("Reduce available token after sold", async()=>{
			const balance = await ftTokenInstance.balanceOf(ftTokenSaleInstance.address);
			assert.equal(balance.toNumber(), TOKENS_AVAILABLE - numberOfTokens, "increments the number of tokens sold")
		});
		
		it("Stop buying with wrong value", async()=>{
			let err = null;
			try {
				await ftTokenSaleInstance.buyTokens(numberOfTokens, {from: BUYER, value: 1});
			} catch (error) {
				err = error;
			}
			assert.ok(err instanceof Error,"stop buying different from ether value");
		});

		it("Stop buying more than available for Token Sale", async()=>{
			let err = null;
			let moreThanAvailable = (TOKENS_AVAILABLE + 100);
			let val = (moreThanAvailable * TOKEN_PRICE);
			try {
				await ftTokenSaleInstance.buyTokens(moreThanAvailable, {from: BUYER, value });
			} catch (error) {
				err = error;
				console.log(err.message);
			}
			assert.ok((err instanceof Error) && (err.message.indexOf("revert") >= 0),"Stop buying more than available for Token Sale");
			// assert.ok(err instanceof Error,"Stop buying more than available for Token Sale");
		});
		
	});


});