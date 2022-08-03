import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import { Button, CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Web3CreateCampaign from '../Web3CreateCampaign';
import { Link } from 'react-router-dom';

export function Association({isAssociation}) {

    const params = useParams();
    
    const [association, setAssociation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/associations/${params.id}`)
            .then((response) => {
                const fetchedData = response.data;
                setAssociation(fetchedData);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setAssociation(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [loading, params]);

    if (loading) return <CircularProgress />
    else if (error || !association) return <h1>Error while fetching data</h1>
    else return (
        <div>
            <Grid container spacing={3} >
                <Grid item xs={12}>
                    <h1>{association.name}</h1>
                    <p>{association.description}</p>
                    {!isAssociation && (<Button variant='contained' component={RouterLink} to={`/associations/${association._id}/donate`}>Donate to the associaton</Button>)}
                </Grid>
                <Grid item xs={12}>
                {isAssociation && (<p>My campaigns: </p>)}
                    {!isAssociation && (<p>Or check for their campaigns and contribute to one of them specifically:</p>)}
                    {isAssociation && ( <Button component={Link} to={`/associations/${params.id}/campaign`} variant="outlined">Add new campaign</Button>)}
                    <br/><br/>
                    <Grid container spacing={2}>
                        {association.campaigns.map((campaign) => (
                            <Grid item xs={3} key={campaign.name}>
                                <Card variant='outlined' component={Paper}>
                                    <CardActionArea component={RouterLink} to={isAssociation ? '' : `/campaign/${campaign._id}/donate`}>
                                        <CardHeader
                                            avatar={
                                                <Avatar aria-label="association">
                                                    {campaign.name[0]}
                                                </Avatar>
                                            }
                                            title={campaign.name}
                                        />
                                    </CardActionArea>
                                    <CardContent>
                                        <Typography variant="body2">
                                            Campaign
                                        </Typography>
                                        {isAssociation && (<Web3CreateCampaign />)}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default Association