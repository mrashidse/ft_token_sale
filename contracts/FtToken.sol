// pragma solidity >=0.4.21 <0.7.0;
pragma solidity ^0.5.0;

contract FtToken {
  address public owner;

  string public name = "FT Token";
  string public symbol = "FTT";
  string public standard = "FT Token v1.0";
  uint8 public decimals = 18;
  uint256 public totalSupply;

  mapping (address => uint256) public balanceOf;
  mapping (address => mapping (address => uint256)) public allowance;

  event Transfer(
          address indexed _from,
          address indexed _to,
          uint256 _value
      );

  constructor(uint256 _initialState) public {
    owner = msg.sender;
    balanceOf[owner] = _initialState;
    totalSupply = _initialState;
  }

  function transfer (address _to, uint256 _value) public returns(bool success) {

    require (balanceOf[owner] >= _value);
    
    balanceOf[owner] -= _value; 
    balanceOf[_to] += _value;

    emit Transfer(owner, _to, _value);
    return true;
  }
  

}
