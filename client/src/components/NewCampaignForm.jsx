import * as React from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { useState } from 'react';



function NewCampaignForm() {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState(0);

    const params = useParams();



    const handleSubmit = async (_evt) => {
        const res = await axios.put(`http://localhost:8080/api/associations/${params.id}`, {
            name: name,
            aimed_amount: goal,
            raised_amount: 0,
            description: description
        });

        alert(JSON.stringify(res.data));
        
    }


    return (
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
    );
}

export default NewCampaignForm;