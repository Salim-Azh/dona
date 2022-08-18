import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import App from '../App';
import Associations from '../components/Associations';
import Association from '../components/Association';
import { AssociationDonation } from '../components/AssociationDonation';
import { CampaignDonation } from '../components/CampaignDonation';
import detectEthereumProvider from '@metamask/detect-provider';
import { RegisterForm } from '../components/RegisterForm';
import NewCampaignForm from '../components/NewCampaignForm';
import axios from 'axios';
import { getWeb3 } from '../getWeb3';

/** React functionnal component that encapsulates the front-end routing logic. */
export function Routing() {

    async function getProvider() { await detectEthereumProvider() };
    const provider = getProvider();

    const [isAssociation, setIsAssociation] = useState(false);
    const [newUser, setNewUser] = useState(false);
    const [loading, setLoading] = useState(true);

    async function start() {
        const web3 = await getWeb3()
        const accounts = await web3.eth.getAccounts();

        let user;
        try {
            await axios.get(`http://localhost:8080/api/users?account_address=${accounts[0]}`)
                .then((response) => {
                    user = response.data[0];
                    if(!user){
                        setNewUser(true);
                    }
                    else if (user && user.isAssociation) {
                        setIsAssociation(true);
                    } else {
                        setIsAssociation(false);
                    }
                })
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        start();
    }, [isAssociation]);

    if (!loading) return (

            <Routes>
                <Route path='/' element={<App />} />
                {provider && newUser && (<Route path='/register' element={<RegisterForm />} />)}
                {provider && (<Route path='/associations' element={<Associations />} />)}
                {provider && (<Route path='/associations/:id' element={<Association isAssociation={isAssociation}/>} />)}
                {provider && (<Route path='/associations/:id/donate' element={<AssociationDonation />} />)}
                {provider && (<Route path='/campaign/:id/donate' element={<CampaignDonation />} />)}
                {provider && (<Route path='/associations/:id/campaign' element={<NewCampaignForm/>} />)}
                <Route path='*' element={
                    <h1>
                        <p>There's nothing here...</p>
                    </h1>
                } />
            </Routes>
    )
}

export default Routing;