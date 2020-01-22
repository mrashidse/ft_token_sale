const FtToken = artifacts.require("./FtToken.sol");

contract("FtToken", (accounts)=>{
	const ADMIN_ACCOUNT = accounts[0];
	const TO_ACCOUNT = accounts[1];
	const SPENDER = accounts[1];
	const NAME_OF_TOKEN = "FT Token";
	const SYMBOL_OF_TOKEN = "FTT";
	const STANDARD_OF_TOKEN = "FT Token v1.0";
	const DECIMALS_OF_TOKEN = 18;
	const TOTAL_SUPPLY_OF_TOKEN = 1000000;
	const FUNDS_MORE_THAN_AVAILABLE = 999999999;
	const TRANSFER_AMOUNT = 250000;
	const APPROVED_TRANSFER_AMOUNT = 100;

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
			assert.equal(name, NAME_OF_TOKEN);
		});

		it("Has a symbol", async()=>{
			const symbol = await ftTokenInstance.symbol();
			assert.equal(symbol, SYMBOL_OF_TOKEN);
		});

		it("Has a standard", async()=>{
			const standard = await ftTokenInstance.standard();
			assert.equal(standard, STANDARD_OF_TOKEN);
		});

		it("Has a decimals", async()=>{
			const decimals = await ftTokenInstance.decimals();
			assert.equal(decimals.toNumber(), DECIMALS_OF_TOKEN);
		});

		it("Has a totalSupply", async()=>{
			const totalSupply = await ftTokenInstance.totalSupply();
			assert.equal(totalSupply.toNumber(), TOTAL_SUPPLY_OF_TOKEN,"sets the total supply to 1,000,000");
		});

		it("Admin has a balanceOf", async()=>{
			const adminBalance = await ftTokenInstance.balanceOf(ADMIN_ACCOUNT);
			// console.log(adminBalance.toNumber());
			assert.equal(adminBalance.toNumber(), TOTAL_SUPPLY_OF_TOKEN, "it allocate total supply to admin");
		});
	});

	describe("Transfer Token Ownership",()=>{
		it("Stop trasfering more than available funds", async()=>{
			let err = null;
			try {
				await ftTokenInstance.transfer.call(TO_ACCOUNT,FUNDS_MORE_THAN_AVAILABLE);
			} catch (error) {
				err = error
			}
			assert.ok(err instanceof Error,"transfer more than available funds must be stopped");
		});
		it("Adds amount into receiving account & deducts from sending account", async()=>{
			await ftTokenInstance.transfer(TO_ACCOUNT, TRANSFER_AMOUNT,{from: ADMIN_ACCOUNT});
			const balanceOfTo = await ftTokenInstance.balanceOf(TO_ACCOUNT);
			const balanceOfFrom = await ftTokenInstance.balanceOf(ADMIN_ACCOUNT);
			const adminBalanceAfterTransaction = (TOTAL_SUPPLY_OF_TOKEN - TRANSFER_AMOUNT);
			assert.equal(balanceOfTo.toNumber(),TRANSFER_AMOUNT,"adds amount to the receiving account");
			assert.equal(balanceOfFrom.toNumber(),adminBalanceAfterTransaction,"deducts amount from the sending account");
		});
		it("Checks transfer event",async ()=>{
			const receipt = await ftTokenInstance.transfer(TO_ACCOUNT, TRANSFER_AMOUNT,{from: ADMIN_ACCOUNT});
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, ADMIN_ACCOUNT, 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to, TO_ACCOUNT, 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, TRANSFER_AMOUNT, 'logs the transfer amount');
		});
		it("Transfer must returns success", async()=>{
			 const result = await ftTokenInstance.transfer.call(TO_ACCOUNT,TRANSFER_AMOUNT, {from: ADMIN_ACCOUNT});
			 assert.equal(result, true,"it returns true");
		});
	});

	describe("Approve Token For Delegated Transfer",()=>{
		

		it("Approve must returns success", async()=>{
			const result = await ftTokenInstance.approve.call(SPENDER, APPROVED_TRANSFER_AMOUNT);
			 // const result = await ftTokenInstance.transfer.call(TO_ACCOUNT,TRANSFER_AMOUNT, {from: ADMIN_ACCOUNT});
			 assert.equal(result, true,"it returns true");
		});
		it("Checks approval event",async ()=>{
			const receipt = await ftTokenInstance.approve(TO_ACCOUNT, APPROVED_TRANSFER_AMOUNT);
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
			assert.equal(receipt.logs[0].args._owner, ADMIN_ACCOUNT, 'logs the account the tokens are authorized by');
			assert.equal(receipt.logs[0].args._spender, SPENDER, 'logs the account the tokens are authorized to');
			assert.equal(receipt.logs[0].args._value, APPROVED_TRANSFER_AMOUNT, 'logs the transfer amount');
		});
		it("Store allowance",async ()=>{
			const allowance = await ftTokenInstance.allowance(ADMIN_ACCOUNT, SPENDER);
			assert.equal(allowance.toNumber(), APPROVED_TRANSFER_AMOUNT, 'stores the allowance for delegated transfer');
		});		
	});

	describe("Delegated Transfer", ()=>{
		const fAccount = accounts[2];
		const tAccount = accounts[3];
		const spendingAccount = accounts[4];
		
		it("Delegated Transfer more than available",async ()=>{
			// transfer some amount to fAccount 
			await ftTokenInstance.transfer(fAccount, APPROVED_TRANSFER_AMOUNT, {from: ADMIN_ACCOUNT});			
			// Approve spendingAccount to spend 10 token from fAccount
			await ftTokenInstance.approve(spendingAccount, 10, {from: fAccount});			
	
			// try transfering something larger than fAccount's balance
			let err = null;
			try {
				await ftTokenInstance.transferFrom(fAccount, tAccount, 9999,{from: spendingAccount});
			} catch (error) {
				err = error
			}
			assert.ok(err instanceof Error,"transfer more than available funds must be stopped");
			// End:
		});
		it("Delegated Transfer more than approved", async()=>{
			// try transfering something larger than approved balance
			let err = null;
			try {
				await ftTokenInstance.transferFrom(fAccount, tAccount, 20,{from: spendingAccount});
			} catch (error) {
				err = error
			}
			assert.ok(err instanceof Error,"transfer more than approved funds must be stopped");
			// End:
		});
		it("Delegated transfer must returns success", async ()=>{
			const result = await ftTokenInstance.transferFrom.call(fAccount, tAccount, 10,  { from: spendingAccount });
			assert.equal(result, true,"it returns true");
		});
		it("Checks transfer event for delegated transfer",async ()=>{
			const receipt = await ftTokenInstance.transferFrom(fAccount, tAccount, 10,  { from: spendingAccount });
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, fAccount, 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to, tAccount, 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
		});
		it("Adds or deducts Balance after delegated transaction", async ()=>{
			
			const balanceOfFAcc = await ftTokenInstance.balanceOf(fAccount);
			assert.equal(balanceOfFAcc.toNumber(), 90, "deduct the amount from sending account");

			const balanceOfTAcc = await ftTokenInstance.balanceOf(tAccount);
			assert.equal(balanceOfTAcc.toNumber(), 10, "add the amount in to receiving account");

			const balanceOfAllowance = await ftTokenInstance.allowance(fAccount,spendingAccount);
			assert.equal(balanceOfAllowance.toNumber(), 0, "deduct the amount from the allowance");
		});
	});
});