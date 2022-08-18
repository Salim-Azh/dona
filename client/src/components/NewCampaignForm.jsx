import * as React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Alert, TextField, Button, Grid } from '@mui/material';


/** React functionnal component that displays a form which allows an association to create a new campaign. */
function NewCampaignForm() {
    const params = useParams();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState(0);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);

    const handleSubmit = async (_evt) => {
        _evt.preventDefault();
        console.log()
        const res = await axios.put(`http://localhost:8080/api/associations/${params.id}`, {
            name: name,
            aimed_amount: goal,
            raised_amount: 0,
            description: description
        });

        if (res.status === 200) {
            setSuccess(true);
            window.location.replace(`/associations/${params.id}`);
        } else {
            setFailure(true);
        }

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction='column' alignItems='center' justifyItems='center'>
                    <Grid item>
                        <label>
                            <TextField type="text" value={name} variant='outlined' label='Name' onChange={e => setName(e.target.value)} required />
                        </label>
                    </Grid>
                    <Grid item>
                        <label>
                            <TextField type="number" variant='outlined' label='Goal' value={goal} onChange={e => setGoal(e.target.value)} required />
                        </label>
                    </Grid>
                    <Grid item>
                        <label>
                            <TextField variant='outlined' label='Description' value={description} onChange={e => setDescription(e.target.value)} required />
                        </label>
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant='contained' value="Create Campaign">Create</Button>
                    </Grid>
                </Grid>
            </form>
            {success && (<Alert severity="success">Campaign successfully saved!</Alert>)}
            {failure && (<Alert severity="error">Error while saving the campaign !</Alert>)}
        </div>
    );
}

export default NewCampaignForm;