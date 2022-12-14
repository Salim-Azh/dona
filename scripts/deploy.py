from brownie import CampaignContract, DonationContract, accounts, network


def main():
    # requires brownie account to have been created
    if network.show_active()=='development':
        # add these accounts to metamask by importing private key
        DonationContract.deploy({'from': accounts[0]})
        CampaignContract.deploy({'from': accounts[0]})

    elif network.show_active() == 'kovan':
        # add these accounts to metamask by importing private key
        owner = accounts.load("test1")
        DonationContract.deploy({'from':owner})
        CampaignContract.deploy({'from':owner})
