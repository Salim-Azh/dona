import { Button, FormControl, InputLabel, Input, Paper } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Web3Form from '../Web3Form';
import './style/DonationForm.css'

export function DonationForm() {
    //TODO: Insert logic to check if the user is connected via Metamask and the payment logic (see in Web3 component)
    const params = useParams();

    const [amount, setAmount] = useState(null);

    return(
        <div className='container'>
            <Paper>
                <h1>Association: {params.id}</h1>
                <Web3Form/>
            </Paper>
        </div>
    )
}