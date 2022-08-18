// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

/** This smart contract handles donations related data and interactions. */
contract DonationContract {

    /** Donation event emitted whenever a donation is sent. */
    event Donation(
        address indexed to,
        address indexed from, 
        uint amount
    );

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }
    
    /** Allows a donator to make a donation to an association. */
    function donate(address payable to_charity) public payable {
        require(msg.value > 0, 'The donation amount has to be greater than 0');
        require(msg.sender != to_charity);
        to_charity.transfer(msg.value);
        emit Donation(to_charity,msg.sender, msg.value);
    }
}
