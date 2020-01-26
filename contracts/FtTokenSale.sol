pragma solidity ^0.5.0;


import "./FtToken.sol";

/**
 * The contractName contract does this and that...
 */
contract FtTokenSale {
	address admin;
	FtToken public tokenContract; 
	uint256 public tokenPrice; 
	uint256 public tokensSold; 

	event Sell(
	    address indexed _buyer,
	    uint256 _amount
	    );

	constructor(FtToken _tokenContract, uint256 _tokenPrice) public {
		// Assign an Admin
		admin = msg.sender;
		
		// Assign Token Contract
		tokenContract = _tokenContract; 
		
		// Token Price
		tokenPrice = _tokenPrice;
	}

	function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "Multiply overflow!");
    }


	function buyTokens(uint256 _numberOfTokens) public payable {
		// require that value is equal to token
		require (msg.value == multiply(_numberOfTokens, tokenPrice));
		
		// require that contract has enough token
		require (tokenContract.balanceOf(address(this)) >= _numberOfTokens);

		// require that transfer is successfull
		require (tokenContract.transfer(msg.sender, _numberOfTokens));
		
		// Keep track of tokenSold
		tokensSold += _numberOfTokens;
		
		// Emit Sell Event
		emit Sell(msg.sender, _numberOfTokens);
	}
	
}
