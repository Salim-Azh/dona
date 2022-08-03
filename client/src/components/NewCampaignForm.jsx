import * as React from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useState } from 'react';
import { Alert } from '@mui/material';



function NewCampaignForm() {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState(0);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);

    const params = useParams();



    const handleSubmit = async (_evt) => {
        _evt.preventDefault();
        
        const res = await axios.put(`http://localhost:8080/api/associations/${params.id}`, {
            name: name,
            aimed_amount: goal,
            raised_amount: 0,
            description: description
        });

        if(res.status == 200) {
            setSuccess(true);
            window.location.replace(`/associations/${params.id}`);
        } else {
            setFailure(true);
        }
        
    }


    return (
        <div>
        <form onSubmit={handleSubmit}>
            <label>
                Name :
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
                Goal :
                <input type="number" value={goal} onChange={e => setGoal(e.target.value)} required />
            </label>
            <label>
                Description :
                <textarea value={description} onChange={e => setDescription(e.target.value)} required />
            </label>
            <input type="submit" value="Create Campaign" />
        </form>
        {success && (<Alert severity="success">Campaign successfully saved!</Alert>)}
        {failure && (<Alert severity="error">Error while saving the campaign !</Alert>)}
        </div>
    );
}

export default NewCampaignForm;