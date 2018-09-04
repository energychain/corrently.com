contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function approve(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }

    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}

contract PreSeed is Owned{

    ERC20Interface public token;
    uint public price;
    uint public next_price;
    uint public next_after;

    constructor(ERC20Interface _token) public {
        token=_token;
    }

    function setPrice(uint _price,uint _validFromBlock) onlyOwner {
        next_price=_price;
        next_after=_validFromBlock;
    }

    function() payable {
        if((block.number>next_after)&&(price!=next_price)) { price = next_price; }
        uint tokens=msg.value/price;
        if(tokens<1) revert();
        if(tokens>token.balanceOf(this)) revert();
        token.transfer(msg.sender,tokens);
        owner.transfer(address(this).balance);
    }
}
