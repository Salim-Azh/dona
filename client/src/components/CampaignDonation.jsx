import * as React from 'react';
import { useParams } from 'react-router-dom';
import CampaignDonationForm from './CampaignDonationForm';
import { Paper } from '@mui/material';
import './style/DonationForm.css'


/** React component that displays a donation form, used by a user to make a donation to an association's campaign. */
export function CampaignDonation() {
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