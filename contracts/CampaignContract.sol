// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

contract CampaignContract {

    uint public nbContributors;
    uint public raisedFunds;
    uint public balance;
    address payable public owner;
    bool public completed;

    event Donation(
        address indexed to,
        address indexed from,
        uint amount
    );

    event Withdrawn(
        address indexed to,
        address indexed from,
        uint amount
    );

    struct Campaign {
        string title;
        string description;
        bool completed; 
        address payable recipient;
        uint256 balance;
    }

    constructor(){
        owner = payable(msg.sender);
        nbContributors = 0;
        balance = 0;
        completed=false;
    }

    function donateToCampaign() public payable {
        require(msg.value > 0, 'The donation amount has to be greater than 0');
        require(completed==false);
        balance += msg.value;
        raisedFunds+=msg.value;
        nbContributors++;
        emit Donation(address(this), msg.sender, msg.value);
    }

    function withdrawFunds() public{
        require(msg.sender == owner);
        require(balance>0);
        owner.transfer(balance);
        emit Withdrawn(msg.sender, address(this), balance);
        balance = 0;
        completed=true;
    }

    /*
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    */
}