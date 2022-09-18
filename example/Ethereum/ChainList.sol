pragma solidity ^0.4.11;

import "./Owned.sol";

contract ChainList is Owned {
  // Custom types
  struct Secret {
    uint id;
    address seller;
    address buyer;
    string name;
    string description;
    string secret;
    uint256 price;
  }

  // State variables
  mapping(uint => Secret) public secrets;
  uint secretCounter;

  // Events
  event sellSecretEvent (
    uint indexed _id,
    address indexed _seller,
    string _name,
    uint256 _price
  );
  event buySecretEvent (
    uint indexed _id,
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  // sell an secret
  function sellSecret(string _name, string _description,string _secret, uint256 _price) public {
    // a new secret
    secretCounter++;

    // store this Secret
    secrets[secretCounter] = Secret(
         secretCounter,
         msg.sender,
         0x0,
         _name,
         _description,
         _secret,
         _price
    );

    // trigger the event
    sellSecretEvent(secretCounter, msg.sender, _name, _price);
  }

  // fetch the number of secrets in the contract
  function getNumberOfSecrets() public constant returns (uint) {
    return secretCounter;
  }

  // fetch and returns all secret IDs available for sale
  function getSecretsForSale() public constant returns (uint[]) {
    // we check whether there is at least one secret
    if(secretCounter == 0) {
      return new uint[](0);
    }

    // prepare intermediary array
    uint[] memory secretIds = new uint[](secretCounter);

    uint numberOfSecretsForSale = 0;
    // iterate over secrets
    for (uint i = 1; i <= secretCounter; i++) {
      // keep only the ID of secrets not sold yet
      if (secrets[i].buyer == 0x0) {
        secretIds[numberOfSecretsForSale] = secrets[i].id;
        numberOfSecretsForSale++;
      }
    }

    // copy the secretIds array into the smaller forSale array
    uint[] memory forSale = new uint[](numberOfSecretsForSale);
    for (uint j = 0; j < numberOfSecretsForSale; j++) {
      forSale[j] = secretIds[j];
    }
    return (forSale);
  }

  // buy an secret
  function buySecret(uint _id) payable public {
    // we check whether there is at least one secret
    require(secretCounter > 0);

    // we check whether the secret exists
    require(_id > 0 && _id <= secretCounter);

    // we retrieve the secret
    Secret storage secret = secrets[_id];

    // we check whether the secret has not already been sold
    require(secret.buyer == 0x0);

    // we don't allow the seller to buy his/her own secret
    require(secret.seller != msg.sender);

    // we check whether the value sent corresponds to the secret price
    require(secret.price == msg.value);

    // keep buyer's information
    secret.buyer = msg.sender;

    // the buyer can buy the secret
    secret.seller.transfer(msg.value);

    // trigger the event
    buySecretEvent(_id, secret.seller, secret.buyer, secret.name, secret.price);
  }

  // kill the smart contract
  function kill() onlyOwner {
    selfdestruct(owner);
  }
}
