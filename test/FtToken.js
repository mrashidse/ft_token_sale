const FtToken = artifacts.require("./FtToken.sol");

contract("FtToken", (accounts)=>{
	const adminAccount = accounts[0];
	const toAccount = accounts[1];
	const nameOfToken = "FT Token";
	const symbolOfToken = "FTT";
	const standardOfToken = "FT Token v1.0";
	const decimalsOfToken = 18;
	const totalSupplyOfToken = 1000000;
	const fundsMoreThanAvailable = 999999999;
	const transferAmount = 250000;

	let ftTokenInstance;

	before(async()=>{
		ftTokenInstance = await FtToken.deployed();
	});

	describe("Deployment",async () =>{
		it("Deployed Successfully!", async()=>{
			const address = await ftTokenInstance.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, '');
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
		});

		it("Has a name", async()=>{
			const name = await ftTokenInstance.name();
			assert.equal(name, nameOfToken);
		});

		it("Has a symbol", async()=>{
			const symbol = await ftTokenInstance.symbol();
			assert.equal(symbol, symbolOfToken);
		});

		it("Has a standard", async()=>{
			const standard = await ftTokenInstance.standard();
			assert.equal(standard, standardOfToken);
		});

		it("Has a decimals", async()=>{
			const decimals = await ftTokenInstance.decimals();
			assert.equal(decimals.toNumber(), decimalsOfToken);
		});

		it("Has a totalSupply", async()=>{
			const totalSupply = await ftTokenInstance.totalSupply();
			assert.equal(totalSupply.toNumber(), totalSupplyOfToken,"sets the total supply to 1,000,000");
		});

		it("Admin has a balanceOf", async()=>{
			const adminBalance = await ftTokenInstance.balanceOf(adminAccount);
			// console.log(adminBalance.toNumber());
			assert.equal(adminBalance.toNumber(), totalSupplyOfToken, "it allocate total supply to admin");
		});
	});

	describe("Transfer Token Ownership",()=>{
		it("Stop trasfering more than available funds", async()=>{
			let err = null;
			try {
				await ftTokenInstance.transfer.call(toAccount,fundsMoreThanAvailable);
			} catch (error) {
				err = error
			}
			assert.ok(err instanceof Error,"transfer more than available funds must be stopped");
		});
		it("Adds amount into receiving account & deducts from sending account", async()=>{
			const receipt = await ftTokenInstance.transfer(toAccount, transferAmount,{from: adminAccount});
			const balanceOfTo = await ftTokenInstance.balanceOf(toAccount);
			const balanceOfFrom = await ftTokenInstance.balanceOf(adminAccount);
			const adminBalanceAfterTransaction = (totalSupplyOfToken - transferAmount);
			assert.equal(balanceOfTo.toNumber(),transferAmount,"adds amount to the receiving account");
			assert.equal(balanceOfFrom.toNumber(),adminBalanceAfterTransaction,"deducts amount from the sending account");
		});
		it("Transfer must returns success", async()=>{
			 const result = await ftTokenInstance.transfer.call(toAccount,transferAmount, {from: adminAccount});
			 assert.equal(result, true,"it returns true");
		});
	});
});