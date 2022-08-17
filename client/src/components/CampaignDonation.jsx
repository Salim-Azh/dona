import * as React from 'react';
import { useParams } from 'react-router-dom';
import CampaignDonationForm from './CampaignDonationForm';
import { Paper } from '@mui/material';
import './style/DonationForm.css'

export function CampaignDonation() {
    //TODO: Insert logic to check if the user is connected via Metamask and the payment logic (see in Web3 component)
    const params = useParams();

    return(
        <div className='container'>
            <Paper>
                <h1>You're about to participate to the funding of a campaign</h1>
                <CampaignDonationForm campaign={params.id}/>
            </Paper>
        </div>
    )
}

export default CampaignDonation;