import * as React from 'react';
import { useParams } from 'react-router-dom';
import Web3FormAsso from '../Web3FormAsso';
import { Paper } from '@mui/material';
import './style/DonationForm.css'

export function DonationForm() {
    const params = useParams();

    return(
        <div className='container'>
            <Paper>
                <h1>Association: {params.id}</h1>
                <Web3FormAsso recipient={params.id}/>
            </Paper>
        </div>
    )
}