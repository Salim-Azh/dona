import React from 'react';
import { getWeb3 } from '../getWeb3';
import axios from 'axios';
import { useState } from 'react';
import { Alert, TextField, Button, Grid, InputLabel, MenuItem, Select, TextareaAutosize } from '@mui/material';
import { useEffect } from 'react';

/** React functionnal component that displays a form used by a user to register. */
export function RegisterForm() {
    //const [isAssociation, setIsAssociation] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email_address: "",
        account_address: "",
        isAssociation: false,
        domain: "",
        description:"",
    });

    useEffect(() => {
        async function start() {
            const web3 = await getWeb3()
            const accounts = await web3.eth.getAccounts();
            setFormData(prevState => ({ ...prevState, account_address: accounts[0] }));
        }
        start()
    }, [failure]);

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        let url;

        if (!formData.isAssociation) {
            setFormData({ ...formData, domain: null });
            url = `http://localhost:8080/api/user`;
        } else {
            url = `http://localhost:8080/api/association`
        }
        const res = await axios.post(url, formData);

        if (res.status === 200) {
            setSuccess(true);
            window.location.replace(`/`);
        } else {
            setFailure(true);
        }

    }


    return (
        <div>
            <h1>Register form</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction='row' alignItems='center' justifyItems='center'>
                    <Grid item xs={6}>
                        <label>
                            <TextField type="text" value={formData.name} variant='outlined' label='Name' onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </label>
                    </Grid>
                    <Grid item xs={6}>
                        <label>
                            <TextField type="email" variant='outlined' label='Email' value={formData.email_address} onChange={e => setFormData({ ...formData, email_address: e.target.value })} required />
                        </label>
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel id="account-type-selector-label">Account type</InputLabel>
                        <Select
                            labelId="account-type-selector-label"
                            id="account-type-selector"
                            value={formData.isAssociation}
                            label="Account type"
                            onChange={e => setFormData({ ...formData, isAssociation: e.target.value })}
                        >
                            <MenuItem value={true}>Association</MenuItem>
                            <MenuItem value={false}>Donator</MenuItem>
                        </Select>
                    </Grid>
                    {formData.isAssociation ? (
                        <div>
                            <Grid item xs={6} my={2}>
                                <label>
                                    <TextField type='text' variant='outlined' label='Domain' value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value })} />
                                </label>
                            </Grid>
                            <Grid item xs={6}>
                                <label>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        placeholder="Describe your mission as an association"
                                        style={{ width: 300 }}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </label>
                            </Grid>
                        </div>
                    ) : null}
                    <Grid item xs={12}>
                        <Button type="submit" variant='contained' value="register">Register</Button>
                    </Grid>
                </Grid>
            </form>
            {success && (<Alert severity="success">Account successfully registered!</Alert>)}
            {failure && (<Alert severity="error">Error while registering...</Alert>)}
        </div>
    )
}

export default RegisterForm;