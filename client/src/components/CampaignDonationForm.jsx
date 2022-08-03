import * as React from 'react';
import { useParams } from 'react-router-dom';
import Web3FormCampaign from '../Web3FormCampaign';
import { Paper } from '@mui/material';
import './style/DonationForm.css'

export function CampaignDonationForm() {
    //TODO: Insert logic to check if the user is connected via Metamask and the payment logic (see in Web3 component)
    const params = useParams();

    return(
        <div className='container'>
            <Paper>
                <h1>Campaign: {params.id}</h1>
                <Web3FormCampaign/>
            </Paper>
        </div>
    )
}

export default CampaignDonationForm;