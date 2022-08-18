import React, { Component } from "react"
import { getWeb3 } from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import { getEthereum } from "./getEthereum"
import { Button, Alert, Chip, Typography } from "@mui/material"

/** React component that allows an association to publish a draft campaign.
 * It is only used inside of the Association component.
 * It uses Web3Js to interact with an Ethereum blockchain node.
 */
class Web3CreateCampaign extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        campaignContract: null,
        success: false,
        successWithdraw: false,
        failure: false,
        isValid: true,
        isCompleted: true,
        goal: 0,
        nbContributors: 0,
        raisedFunds: 0
    }

    componentDidMount = async () => {

        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum()
            ethereum.enable()
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`)
            console.log(e)
        }

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts()

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId())

        this.setState({
            web3,
            accounts,
            chainid
        }, await this.loadInitialContracts)

    }

    loadInitialContracts = async () => {
        // <=42 to exclude Kovan, <42 to include kovan
        if (this.state.chainid < 42) {
            // Wrong Network!
            return
        }

        var _chainID = 0;
        if (this.state.chainid === 42) {
            _chainID = 42;
        }
        if (this.state.chainid === 1337) {
            _chainID = "dev"
        }

        const campaignContract = await this.loadContract(_chainID, "CampaignContract");

        if (!campaignContract) {
            return
        }

        const isValid = await campaignContract.methods.isCampaignValid(this.props.campaign._id).call();
        const isCompleted = await campaignContract.methods.isCampaignCompleted(this.props.campaign._id).call();
        const goal = await campaignContract.methods.getGoal(this.props.campaign._id).call();
        const nbContributors = await campaignContract.methods.getNbContributors(this.props.campaign._id).call();
        const raisedFunds = await campaignContract.methods.getCampaignRaisedFunds(this.props.campaign._id).call();

        this.setState({
            campaignContract,
            isValid,
            isCompleted,
            goal,
            nbContributors,
            raisedFunds,
        })

    }

    loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        const { web3 } = this.state

        // Get the address of the most recent deployment from the deployment map
        let address
        try {
            address = map[chain][contractName][0]
        } catch (e) {
            console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`)
            return undefined
        }

        // Load the artifact with the specified address
        let contractArtifact
        try {
            contractArtifact = await import(`./artifacts/deployments/${chain}/${address}.json`)
        } catch (e) {
            console.log(`Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`)
            return undefined
        }

        return new web3.eth.Contract(contractArtifact.abi, address)
    }

    createCampaigns = async () => {
        const { campaignContract, accounts } = this.state

        if (campaignContract) {

            await campaignContract.methods.createCampaign(
                this.props.campaign._id,
                this.props.association.account_address,
                this.props.campaign.aimed_amount
            ).send({ from: accounts[0] })
                .on('receipt', async () => {
                    this.setState({
                        successCreate: true,
                        isValid: await campaignContract.methods.isCampaignValid(this.props.campaign._id).call(),
                        isCompleted: await campaignContract.methods.isCampaignCompleted(this.props.campaign._id).call(),
                        goal: await campaignContract.methods.getGoal(this.props.campaign._id).call(),
                        nbContributors: await campaignContract.methods.getNbContributors(this.props.campaign._id).call(),
                        raisedFunds: await campaignContract.methods.getCampaignRaisedFunds(this.props.campaign._id).call(),
                    });
                })
        }
    }

    withdraw = async () => {
        const { campaignContract, accounts } = this.state

        if (campaignContract) await campaignContract.methods.withdrawFunds(this.props.campaign._id).send({ from: accounts[0] })
            .on('receipt', async () => {
                this.setState({
                    successWithdraw: true,
                    isCompleted: await campaignContract.methods.isCampaignCompleted(this.props.campaign._id).call()
                });
            })
    }

    render() {
        return (
            <div>
                
                {
                    /*The contract is not deployed. The campaign is not open yet*/
                    !this.state.isValid && (
                        <div>
                            <Typography variant="caption" display="block" gutterBottom>
                                The campaign is only visible to you. You need to publish the campaign to make it public and open for funding
                            </Typography>
                            <Chip label="Campaign draft" color="warning" variant="outlined" />
                            <Button onClick={() => this.createCampaigns()}> Publish </Button>
                        </div>
                    )
                }

                {
                    /*The contract is deployed. The campaign is not open for fundings*/
                    this.state.isValid && !this.state.isCompleted && (
                        <div>
                            <Typography variant="body2" gutterBottom>
                                Goal: {this.state.goal} <br/>
                                Raised funds: {this.state.raisedFunds / 1000000000000000000 } <br/>
                                Contributions: {this.state.nbContributors}
                            </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                If you withdraw the funds the campaign will be closed
                            </Typography>
                            <Chip label="Campaign open" color="success" variant="outlined" />
                            <Button onClick={() => this.withdraw()}> Withdraw </Button>
                        </div>
                    )
                }

                {
                    /*The campaign is closed. The funds have been withdrawn*/
                    this.state.isCompleted && (
                        <div>
                            <Typography variant="body2" gutterBottom>
                                Goal: {this.state.goal} <br/>
                                Raised funds: {this.state.raisedFunds / 1000000000000000000 } <br/>
                                Contributions: {this.state.nbContributors}
                            </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                Funds withdrawn
                            </Typography>
                            <Chip label="Campaign closed" color="default" variant="outlined" />
                        </div>
                    )
                }

                {this.state.failure && (<Alert severity="error">There has been an error...</Alert>)}

                {this.state.successCreate && (<Alert severity="success">Campaign successfully created!</Alert>)}
                {this.state.successWithdraw && (<Alert severity="success">Founds successfully withdrawn!</Alert>)}

            </div>
        )
    }
}

export default Web3CreateCampaign
