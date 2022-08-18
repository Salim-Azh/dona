import * as React from 'react';
import { useParams } from 'react-router-dom';
import AssociationDonationFrom from './AssociationDonationFrom';
import { Paper } from '@mui/material';
import './style/DonationForm.css'

/** React functionnal component used to display a donation form from a donator to an association.
 * The association is identified by it's id, stored in the request's params.
 */
export function AssociationDonation() {
    const params = useParams();

    return(
        <div className='container'>
            <Paper>
                <h1>Donate to an association</h1>
                <AssociationDonationFrom recipient={params.id}/>
            </Paper>
        </div>
    )
}