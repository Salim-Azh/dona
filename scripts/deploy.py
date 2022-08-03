from brownie import CampaignContract, DonationContract, SolidityStorage, accounts, network


def main():
    # requires brownie account to have been created
    if network.show_active()=='development':
        # add these accounts to metamask by importing private key
        owner = accounts[0]
        SolidityStorage.deploy({'from':accounts[0]})
        DonationContract.deploy({'from': accounts[0]})
        CampaignContract.deploy({'from': accounts[0]})

    elif network.show_active() == 'kovan':
        # add these accounts to metamask by importing private key
        owner = accounts.load("test1")
        SolidityStorage.deploy({'from':owner})
        DonationContract.deploy({'from':owner})
        CampaignContract.deploy({'from':owner})
