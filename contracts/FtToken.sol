// pragma solidity >=0.4.21 <0.7.0;
pragma solidity ^0.5.0;

contract FtToken {
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

  event Approval(
    address indexed _owner, 
    address indexed _spender, 
    uint256 _value);

  constructor(uint256 _initialState) public {
    balanceOf[msg.sender] = _initialState;
    totalSupply = _initialState;
  }

  function transfer (address _to, uint256 _value) public returns(bool success) {

    require (balanceOf[msg.sender] >= _value);
    
    balanceOf[msg.sender] -= _value; 
    balanceOf[_to] += _value;

    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success){
    // Allowance
    allowance[msg.sender][_spender] = _value;
    // Approval Event
    emit Approval(msg.sender,_spender,_value);

    return true;
  }

  function transferFrom (address _from, address _to, uint256 _value) public returns (bool success){
    // Require _from has enough tokens
    require (balanceOf[_from] >= _value);
    // Require allowance is big enough
    require (allowance[_from][msg.sender] >= _value);

    // Change the balance
    balanceOf[_from] -= _value; 
    balanceOf[_to] += _value;
    // Update the allowance
    allowance[_from][msg.sender] -= _value;
    // Transfer event
    emit Transfer(_from, _to, _value);
    // // return a boolean
    return true;
  }

  

}
