import React from 'react';
import { Routes, Route } from 'react-router-dom'
import App from '../App';
import Associations from '../components/Associations';
import Association from '../components/Association';
import { DonationForm } from '../components/DonationForm';
import { CampaignDonationForm } from '../components/CampaignDonationForm';
import detectEthereumProvider from '@metamask/detect-provider';
import NewCampaignForm from '../components/NewCampaignForm';
import { useState } from 'react'
import axios from 'axios';
import { getWeb3 } from '../getWeb3';

export function Routing() {

    async function getProvider() { await detectEthereumProvider() };
    const provider = getProvider();

    const [isAssociation, setIsAssociation] = useState(false);
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
                        //window.location.replace(`/associations/${user._id}`);
                        //console.log('reload association')
                    } else {
                        setIsAssociation(false);
                        //console.log('reload donator')
                        //window.location.replace('/associations');
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
        <>
            <Routes>
                <Route path='/' element={<App />} />
                {provider && (<Route path='/associations' element={<Associations />} />)}
                {provider && (<Route path='/associations/:id' element={<Association isAssociation={isAssociation}/>} />)}
                {provider && (<Route path='/associations/:id/donate' element={<DonationForm />} />)}
                {provider && (<Route path='/campaign/:id/donate' element={<CampaignDonationForm />} />)}
                {provider && (<Route path='/associations/:id/campaign' element={<NewCampaignForm/>} />)}
                <Route path='*' element={
                    <h1>
                        <p>There's nothing here...</p>
                    </h1>
                } />
            </Routes>
        </>
    )
}

export default Routing;