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
        bool valid;
        bool completed; 
        uint nbContributors;
        uint raisedFunds;
        uint balance;
        address payable recipient;
        uint goal;
    }

    mapping(string => Campaign) public campaigns;


    constructor(){
        owner = payable(msg.sender);
    }

    function createCampaign(string memory objectID ,address payable recipient, uint goal) public{
        //require(msg.sender is a charity);
        Campaign storage newCampaign = campaigns[objectID];
        newCampaign.recipient = recipient;
        newCampaign.balance = 0;
        newCampaign.raisedFunds = 0;
        newCampaign.nbContributors =0;
        newCampaign.completed = false;
        newCampaign.valid = true;
        newCampaign.goal = goal;
    }

    function donateToCampaign(string memory objectID) public payable {
        require(msg.value > 0, 'The donation amount has to be greater than 0');
        require(campaigns[objectID].valid == true, 'The campaign needs to be created');
        Campaign storage campaign = campaigns[objectID];
        require(campaign.completed==false, 'This campaign is already closed');
        campaign.balance += msg.value;
        campaign.raisedFunds+=msg.value;
        campaign.nbContributors++;
        emit Donation(campaign.recipient, msg.sender, msg.value);
    }

    function withdrawFunds(string memory objectID) public{
        Campaign storage campaign = campaigns[objectID];
        require(msg.sender == campaign.recipient, 'Unauthorized you need to be the recipient');
        require(campaign.balance>0, 'No funds to be withdrawn');
        campaign.recipient.transfer(campaign.balance);
        emit Withdrawn(msg.sender, address(this), campaign.balance);
        campaign.balance = 0;
        campaign.completed=true;
    }

    function isCampaignValid(string memory objectID)public view returns(bool){
        return campaigns[objectID].valid;
    }

    function isCampaignCompleted(string memory objectID)public view returns(bool){
        return campaigns[objectID].completed;
    }

    function getCampaignRaisedFunds(string memory objectID) public view returns(uint){
        return campaigns[objectID].raisedFunds;
    }

    function getNbContributors(string memory objectID) public view returns(uint){
        return campaigns[objectID].nbContributors;
    }

    function getGoal(string memory objectID) public view returns(uint){
        return campaigns[objectID].goal;
    }
}