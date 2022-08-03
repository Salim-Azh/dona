import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom'
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';

export function Associations() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/associations`)
            .then((response) => {
                const fetchedData = response.data;
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

    if (error) return <h1>Error while fetching data</h1>

    return (
        <div>
            <h1>Associations</h1>
            {loading ? <CircularProgress /> : (
                <Grid container spacing={2}>
                    {data.map((association) => (
                        <Grid item xs={4} key={association._id}>
                                <Card variant='outlined' component={Paper}>
                                <CardActionArea component={RouterLink} to={`/associations/${association._id}`}>
                                        <CardHeader
                                            avatar={
                                                <Avatar aria-label="association">
                                                    {association.name[0]}
                                                </Avatar>
                                            }
                                            title={association.name}
                                            subheader={association.domain}
                                        />
                                        <CardContent>
                                            <Typography variant="body2">
                                                {association.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>

    )
}

export default Associations