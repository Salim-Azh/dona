import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Button } from "@mui/material"


class Web3CreateCampaign extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        campaignContract: null
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
        if (this.state.chainid === 42){
            _chainID = 42;
        }
        if (this.state.chainid === 1337){
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
        const {web3} = this.state

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
        const {campaignContract, accounts} = this.state
  
        if(campaignContract) await campaignContract.methods.createCampaign('1','0xfA5a4C6a3221a31a322DfCca50fD433d7D681eb8').send({from: accounts[0]})
        .on('receipt', async () => {
            let test = await campaignContract.methods.returnMappingValue('1').call();
            console.log(test);
        })
    }

    withdraw = async () => {
        const {campaignContract, accounts} = this.state
  
        if(campaignContract) await campaignContract.methods.withdrawFunds('1').send({from: accounts[0]})
        .on('receipt', async () => {
            let test = await campaignContract.methods.returnMappingValue('1').call();
            console.log(test);
        })
    }

    render() {
        return (
            <div>
                <Button onClick={() => this.createCampaigns()}> Create </Button>
                <Button onClick={() => this.withdraw()}> Withdraw </Button>
        </div>
        )
    }
}

export default Web3CreateCampaign
