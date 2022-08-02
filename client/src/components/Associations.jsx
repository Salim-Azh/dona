import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import { CircularProgress } from '@mui/material';

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

       if(error) return <h1>Error while fetching data</h1>

       return (
        <div>
            <h1>Associations</h1>

            <TableContainer component={Paper}>
                {loading ? <CircularProgress /> : (
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Association</TableCell>
                        <TableCell align="right">Domain</TableCell>
                        <TableCell align="right">Contact</TableCell>
                        <TableCell align="right">Donate</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((asso) => (
                        <TableRow
                        key={asso._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {asso.name}
                        </TableCell>
                        <TableCell align="right">{asso.domain}</TableCell>
                        <TableCell align="right">{asso.email_address}</TableCell>
                        <TableCell align="right"> 
                            <Link to= {`/associations/${asso.id}/donnate`} >
                                <Button variant="contained">Donate</Button>
                            </Link>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                )}
            </TableContainer>
     </div>

    )
}

export default Associations