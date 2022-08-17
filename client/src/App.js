import * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { getWeb3 } from './getWeb3';
import detectEthereumProvider from '@metamask/detect-provider';
import { Button, CircularProgress } from '@mui/material';

export function App() {

    async function getProvider() { await detectEthereumProvider() };
    const provider = getProvider();

    const [isAssociation, setIsAssociation] = useState(false);
    const [connectedUser, setConnectedUser] = useState({});
    const [loading, setLoading] = useState(true);

    async function start() {
        const web3 = await getWeb3()
        const accounts = await web3.eth.getAccounts();

        let user;
        try {
            await axios.get(`http://localhost:8080/api/users?account_address=${accounts[0]}`)
                .then((response) => {
                    user = response.data[0];
                    if (user && user.isAssociation) {
                        setIsAssociation(true);
                    } else {
                        setIsAssociation(false);
                    }
                    setConnectedUser(user);
                })
        } catch (error) {
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }

    React.useEffect(() => {
        start();
    }, [isAssociation]);

    let content;
    if(!provider || !connectedUser) content = <p>You need to be connected to your MetaMask account to use this website.</p>
    else if (connectedUser && connectedUser.isAssociation) content = connectedUser.isAssociation && (<Button to={`/associations/${connectedUser._id}`} component={Link} variant='contained'>Get started as an Association</Button>)
    else if (connectedUser) content = <Button to='/associations' component={Link} variant='contained'>Get started as a Donator</Button>
    
    return (
        <div>
            <h1>Welcome to DonaTrack!</h1>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {loading ? (<CircularProgress />) : content}
            </div>
        </div>
    )
};

export default App;