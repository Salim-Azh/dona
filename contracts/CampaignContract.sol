// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

/** This smart contract handles campaign related data and interaction. */
contract CampaignContract {

    address payable public owner;

    /** Donation event emitted whenever a donation is sent. */
    event Donation(
        address indexed to,
        address indexed from,
        uint amount
    );

    /** Withdrawn event emitted whenever a campaign's funds are withdrawn by it's association. */
    event Withdrawn(
        address indexed to,
        address indexed from,
        uint amount
    );

    /** Representation of a campaign's blockchain stored data. */
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

    /** Creates a new campaign which will be stored on the blockchain.*/
    function createCampaign(string memory objectID ,address payable recipient, uint goal) public{
        Campaign storage newCampaign = campaigns[objectID];
        newCampaign.recipient = recipient;
        newCampaign.balance = 0;
        newCampaign.raisedFunds = 0;
        newCampaign.nbContributors =0;
        newCampaign.completed = false;
        newCampaign.valid = true;
        newCampaign.goal = goal;
    }

    /** Allows a donator to proceed to a donation to an association's campaign. */
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

    /** Allows an association to withdraw the total amount of a Campaign's collected founds. */
    function withdrawFunds(string memory objectID) public{
        Campaign storage campaign = campaigns[objectID];
        require(msg.sender == campaign.recipient, 'Unauthorized you need to be the recipient');
        require(campaign.balance>0, 'No funds to be withdrawn');
        campaign.recipient.transfer(campaign.balance);
        emit Withdrawn(msg.sender, address(this), campaign.balance);
        campaign.balance = 0;
        campaign.completed=true;
    }

    /** Indicates if a campaign is valid. A valid campaign is a campaign that has been published by it's association.
      */
    function isCampaignValid(string memory objectID)public view returns(bool){
        return campaigns[objectID].valid;
    }

    /** Indicates if a campaign is completed. A campaign is considered completed as soon as it's association has withdrawn the collected founds.  */
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