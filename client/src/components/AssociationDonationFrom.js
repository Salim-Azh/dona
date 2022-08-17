import React, { Component } from "react"
import { getWeb3 } from "../getWeb3"
import map from "../artifacts/deployments/map.json"
import { getEthereum } from "../getEthereum"
import axios from "axios"
import { Alert, Button, TextField, Grid } from '@mui/material';



class AssociationDonationFrom extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        donationContract: null,
        solidityInput: 0,
        association: null,
        success: false,
        failure: false
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

        const data = await axios.get(`http://localhost:8080/api/associations/${this.props.recipient}`);
        const association = data.data;

        this.setState({
            web3,
            accounts,
            chainid,
            association
        }, await this.loadInitialContracts)

    }

    loadInitialContracts = async () => {
        // <=42 to exclude Kovan, <42 to include kovan
        if (this.state.chainid < 42) {
            // Wrong Network!
            return
        }
        console.log(this.state.chainid)

        let _chainID = 0;
        if (this.state.chainid === 42) {
            _chainID = 42;
        }
        if (this.state.chainid === 1337) {
            _chainID = "dev"
        }

        const donationContract = await this.loadContract(_chainID, "DonationContract")

        if (!donationContract) {
            return
        }


        this.setState({
            donationContract
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

    execTransaction = async (e) => {
        const { accounts, donationContract, solidityInput } = this.state
        e.preventDefault()
        const value = parseInt(solidityInput) * 1000000000000000000
        if (isNaN(value)) {
            alert("invalid value")
            return
        }
        await donationContract.methods.donate(this.state.association.account_address).send({ from: accounts[0], value: value })
            .on('receipt', async () => {
                this.setState({ success: true });
            })
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

        return (<div className="Web3Form">
            <p>
                Thanks for your interrest in this association's work!
            </p>
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }

            <br />
            <form onSubmit={(e) => this.execTransaction(e)}>
                <Grid container spacing={2} alignItems='center' justifyContent='center' paddingBottom={3}>
                    <Grid item xs={4}>
                        <TextField
                            name="solidityInput"
                            type="text"
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
            {this.state.failure && (<Alert severity="error">Error while sending the transaction...</Alert>)}
        </div>)
    }
}

export default AssociationDonationFrom
