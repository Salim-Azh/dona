// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

contract DonationContract {
    address payable owner;
    
    constructor() {
        owner = payable(msg.sender);
    }

    function donate() public payable {
        require(msg.value > 0, 'The donation amount has to be greater than 0');
        owner.transfer(msg.value);
    }

    function withdraw() public {
        require(owner==msg.sender, 'Available only to the to the user that deployed the contract');
        owner.transfer(address(this).balance);
    }
}
