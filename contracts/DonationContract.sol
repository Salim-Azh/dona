// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

contract DonationContract {

    event Donation(
        address indexed to,
        address indexed from, 
        uint amount
    );

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function donate(address payable to_charity) public payable {
        require(msg.value > 0, 'The donation amount has to be greater than 0');
        to_charity.transfer(msg.value);
        emit Donation(to_charity,msg.sender, msg.value);
    }

   /* function withdraw() public {
        require(owner==msg.sender, 'Available only to the to the user that deployed the contract');
        owner.transfer(address(this).balance);
    }*/
}
