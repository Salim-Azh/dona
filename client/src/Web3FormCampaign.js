import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"


class Web3FormCampaign extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        solidityStorage: null,
        solidityValue: 0,
        donationContract: null,
        solidityInput: 0,
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

        const solidityStorage = await this.loadContract(_chainID,"SolidityStorage")
        const donationContract = await this.loadContract(_chainID,"DonationContract")
        const campaignContract = await this.loadContract(_chainID, "CampaignContract")

        if (!solidityStorage || !donationContract || !campaignContract) {
            return
        }

        const solidityValue = await solidityStorage.methods.get().call()

        this.setState({
            solidityStorage,
            solidityValue,
            donationContract,
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

    changeSolidity = async (e) => {
        const {accounts, solidityStorage, solidityInput} = this.state
        e.preventDefault()
        const value = parseInt(solidityInput)
        if (isNaN(value)) {
            alert("invalid value")
            return
        }
        await solidityStorage.methods.set(value).send({from: accounts[0]})
            .on('receipt', async () => {
                this.setState({
                    solidityValue: await solidityStorage.methods.get().call()
                })
            })
    }

    execTransaction = async (e) => {
        const {accounts, donationContract, solidityInput} = this.state
        e.preventDefault()
        const value = parseInt(solidityInput) * 1000000000000000000
        if (isNaN(value)) {
            alert("invalid value")
            return
        }
        await donationContract.methods.donate('0xfA5a4C6a3221a31a322DfCca50fD433d7D681eb8').send({from: accounts[0], value: value})
        //set(value).send({from: accounts[0]})
            .on('receipt', async () => {
                console.log('YESSS')
            })
    }

    execTransactionToCampaign = async (e) => {
        const {accounts, solidityInput, campaignContract} = this.state
        e.preventDefault()
        const value = parseInt(solidityInput) * 1000000000000000000
        if (isNaN(value)) {
            alert("invalid value")
            return
        }
        await campaignContract.methods.donateToCampaign(this.props.campaign).send({from: accounts[0], value: value})
        //set(value).send({from: accounts[0]})
            .on('receipt', async () => {
                let test = await campaignContract.methods.returnMappingValue(this.props.campaign).call();
                console.log(test);
            })
    }

    render() {

        const {
            web3, accounts, chainid,
            solidityStorage, solidityValue, solidityInput
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        // <=42 to exclude Kovan, <42 to include Kovan
        if (isNaN(chainid) || chainid < 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!solidityStorage) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false

        return (<div className="Web3Form">
            <h1>Your Brownie Mix is installed and ready.</h1>
            <p>
                If your contracts compiled and deployed successfully, you can see the current
                storage values below.
            </p>
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
            
            <h2>Solidity Storage Contract</h2>
            <div>The stored value is: {solidityValue}</div>
            <br/>
            <form onSubmit={(e) => this.execTransactionToCampaign(e)}>
                <div>
                    <label>Change the value to: </label>
                    <br/>
                    <input
                        name="solidityInput"
                        type="text"
                        value={solidityInput}
                        onChange={(e) => this.setState({solidityInput: e.target.value})}
                    />
                    <br/>
                    <button type="submit" disabled={!isAccountsUnlocked}>Submit Association</button>

                </div>
            </form>
        </div>)
    }
}

export default Web3FormCampaign
