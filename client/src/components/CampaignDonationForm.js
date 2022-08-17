import React, { Component } from "react"
import { getWeb3 } from "../getWeb3"
import map from "../artifacts/deployments/map.json"
import { getEthereum } from "../getEthereum"
import { Alert, TextField, Grid, Button } from '@mui/material';

class CampaignDonationForm extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        solidityInput: 0,
        campaignContract: null,
        success: false,
        failure: false,
        errorMessage: "",
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
        console.log(this.state.chainid)

        var _chainID = 0;
        if (this.state.chainid === 42) {
            _chainID = 42;
        }
        if (this.state.chainid === 1337) {
            _chainID = "dev"
        }

        const campaignContract = await this.loadContract(_chainID, "CampaignContract")

        if (!campaignContract) {
            return
        }


        this.setState({
            campaignContract
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

    execTransactionToCampaign = async (e) => {
        const { accounts, solidityInput, campaignContract } = this.state
        e.preventDefault()
        const value = parseInt(solidityInput) * 1000000000000000000 //convert wei in ether
        if (isNaN(value)) {
            alert("invalid value")
            return
        }
        await campaignContract.methods.donateToCampaign(this.props.campaign).send({ from: accounts[0], value: value })
            .on('receipt', async () => {
                await campaignContract.methods.returnMappingValue(this.props.campaign).call();
                this.setState({ success: true, failure: false});
            })
            .on('error', (err)=>{
                this.setState({ failure: true, success: false, errorMessage: err.message});
            });
    }

    render() {

        const {
            web3, accounts, chainid, solidityInput
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        // <=42 to exclude Kovan, <42 to include Kovan
        if (isNaN(chainid) || chainid < 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false

        return (
            <div className="Web3Form">
                <p>
                    Thanks for for your interrest in this campaign!
                </p>
                {
                    !isAccountsUnlocked ?
                        <p><strong>Connect with Metamask and refresh the page to
                            be able to edit the storage fields.</strong>
                        </p>
                        : null
                }

                <br />
                <form onSubmit={(e) => this.execTransactionToCampaign(e)}>
                    <Grid container spacing={2} alignItems='center' justifyContent='center' paddingBottom={3}>
                        <Grid item xs={4}>
                            <TextField
                                name="solidityInput"
                                type="text"
                                variant="outlined"
                                value={solidityInput}
                                onChange={(e) => this.setState({ solidityInput: e.target.value })}
                            />
                        </Grid>
                        <Grid item>
                            <Button type="submit" disabled={!isAccountsUnlocked} variant='contained'>Send</Button>
                        </Grid>
                    </Grid>
                </form>
                {this.state.success && (<Alert severity="success">Transaction successfully sent!</Alert>)}
                {this.state.failure && (<Alert severity="error">{this.state.errorMessage}</Alert>)}
            </div>)
    }
}

export default CampaignDonationForm
