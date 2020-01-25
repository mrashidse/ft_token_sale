pragma solidity ^0.5.0;


import "./FtToken.sol";

/**
 * The contractName contract does this and that...
 */
contract FtTokenSale {
	address admin;
	FtToken public tokenContract; 
	uint256 public tokenPrice; 

	constructor(FtToken _tokenContract, uint256 _tokenPrice) public {
		// Assign an Admin
		admin = msg.sender;
		
		// Assign Token Contract
		tokenContract = _tokenContract; 
		
		// Token Price
		tokenPrice = _tokenPrice;
	}
}
