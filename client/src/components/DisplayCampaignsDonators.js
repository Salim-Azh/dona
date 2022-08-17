import React, { Component } from "react"
import { getWeb3 } from "../getWeb3"
import map from "../artifacts/deployments/map.json"
import { getEthereum } from "../getEthereum"
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Card, CardActionArea, CardContent, CardHeader, Grid, Paper, Typography } from "@mui/material"

class DisplayCampaignsDonators extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        campaignContract: null,
        openCampaigns: []
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

        const campaigns = this.props.association.campaigns
        await this.getOpenCampaigns(campaigns, campaignContract)

        this.setState({
            campaignContract,
        })



    }

    getOpenCampaigns = async (campaigns, campaignContract)=>{
        let openCampaigns = []
        await campaigns.map(async (campaign) => {
            const isValid = await campaignContract.methods.isCampaignValid(campaign._id).call();
            const isCompleted = await campaignContract.methods.isCampaignCompleted(campaign._id).call();
            if (isValid && !isCompleted) {
                const goal = await campaignContract.methods.getGoal(campaign._id).call();
                const nbContributors = await campaignContract.methods.getNbContributors(campaign._id).call();
                const raisedFunds = await campaignContract.methods.getCampaignRaisedFunds(campaign._id).call();
                openCampaigns.push({
                    name: campaign.name,
                    description: campaign.description,
                    _id: campaign._id,
                    goal: goal,
                    nbContributors: nbContributors,
                    raisedFunds: raisedFunds / 1000000000000000000,
                })
                let newUserArray = [...openCampaigns]

                this.setState({openCampaigns: newUserArray}) 
            }
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
            contractArtifact = await import(`../artifacts/deployments/${chain}/${address}.json`)
        } catch (e) {
            console.log(`Failed to load contract artifact "../artifacts/deployments/${chain}/${address}.json"`)
            return undefined
        }

        return new web3.eth.Contract(contractArtifact.abi, address)
    }

    render() {
        return (
            <Grid container spacing={2}>
                {this.state.openCampaigns.map((campaign) => (
                    <Grid item xs={3} key={campaign.name}>
                        <Card variant='outlined' component={Paper}>
                            <CardActionArea component={RouterLink} to={`/campaign/${campaign._id}/donate`}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="association">
                                            {campaign.name[0]}
                                        </Avatar>
                                    }
                                    title={campaign.name}
                                />
                            </CardActionArea>
                            <CardContent>
                                <Typography mb={2} variant="body2" gutterBottom>
                                    {campaign.description}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Goal: {campaign.goal} <br/>
                                    Raised funds: {campaign.raisedFunds } <br/>
                                    Contributions: {campaign.nbContributors}
                            </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                 ))}
            </Grid>
        )
    }
}

export default DisplayCampaignsDonators
