// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

contract CampaignContract {

    address payable public owner;

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
        bool completed; 
        uint nbContributors;
        uint raisedFunds;
        uint balance;
        address payable recipient;
    }

    mapping(string => Campaign) public campaigns;


    constructor(){
        owner = payable(msg.sender);
    }

    function createCampaign(string memory objectID ,address payable recipient) public{
        //require(msg.sender is a charity);
        Campaign storage newCampaign = campaigns[objectID];
        newCampaign.recipient = recipient;
        newCampaign.balance = 0;
        newCampaign.raisedFunds = 0;
        newCampaign.nbContributors =0;
        newCampaign.completed = false;
    }

    function donateToCampaign(string memory objectID) public payable {
        require(msg.value > 0, 'The donation amount has to be greater than 0');
        Campaign storage campaign = campaigns[objectID];
        require(campaign.completed==false);
        campaign.balance += msg.value;
        campaign.raisedFunds+=msg.value;
        campaign.nbContributors++;
        emit Donation(campaign.recipient, msg.sender, msg.value);
    }

    function withdrawFunds(string memory objectID) public{
        Campaign storage campaign = campaigns[objectID];
        require(msg.sender == campaign.recipient);
        require(campaign.balance>0);
        campaign.recipient.transfer(campaign.balance);
        emit Withdrawn(msg.sender, address(this), campaign.balance);
        campaign.balance = 0;
        campaign.completed=true;
    }
}