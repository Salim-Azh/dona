import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Web3CreateCampaign from '../Web3CreateCampaign';

export function Association() {

    const params = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
        axios.get(`http://localhost:8080/api/associations/${params.id}`)
            .then((response) => {
                const fetchedData = response.data;
                console.log('data = ', fetchedData)
                setData(fetchedData);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (error || !data) return <h1>Error while fetching data</h1>


    return (
        <div>
            <h1>{data.name}</h1>
            {loading ? <CircularProgress /> : (
                <Grid container spacing={2}>
                    {data.campaigns.map((campaign) => (
                        <Grid item xs={4} key={campaign.name}>
                                <Card variant='outlined' component={Paper}>
                                <CardActionArea component={RouterLink} to={`/campaign/${campaign._id}/donate`}>
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
                                            <Web3CreateCampaign/>

                                        </CardContent>
                                </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>

    )
}

export default Association