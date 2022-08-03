import * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { getWeb3 } from './getWeb3';

export function App() {

    const [isAssociation, setIsAssociation] = useState(false);
    const [connectedUser, setConnectedUser] = useState({});

    async function start() {
        const web3 = await getWeb3()
        const accounts = await web3.eth.getAccounts();
        // Check whether the current user is a User or a Member
        let user;
        try {
            console.log('acc = ', accounts[0]);
            await axios.get(`http://localhost:8080/api/users?account_address=${accounts[0]}`)
                .then((response) => {
                    user = response.data[0];
                    if (user && user.isAssociation) {
                        setIsAssociation(true);
                        //window.location.replace(`/associations/${user._id}`);
                        //console.log('reload association')
                    } else {
                        setIsAssociation(false);
                        //console.log('reload donator')
                        //window.location.replace('/associations');
                    }
                    setConnectedUser(user);
                })
        } catch (error) {
            console.log(error);
        } finally {
            console.log('App user = ', user);
        }

    }

    React.useEffect(() => {
        start();
    }, [isAssociation]);

    console.log(connectedUser);
    
    return (
        <div>
            <h1>Welcome to DonaTrack!</h1>
            {connectedUser && !connectedUser.isAssociation && (<Link to='/associations'>Get started as a Donator</Link>)}
            {connectedUser && (connectedUser.isAssociation == true) && (<Link to={`/associations/${connectedUser._id}`}>Get started as an Association</Link>)}
        </div>
    )
};

export default App;