import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import CustomHeader from './CustomHeader';
import { CustomFooter } from './Footer';

export function Associations() {

    function createData(name, field) {
        return { name, field };
      }
      
      const rows = [
        createData('Sea shepard', "Animal protection"),
        createData('Green peace', "Ecological actions"),
        createData('Croix rouge', "Charity association")
      ];

    return (
        <div>
            <CustomHeader/>

            <h1>Associations</h1>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Association</TableCell>
                        <TableCell align="right">Field</TableCell>
                        <TableCell align="right">Donate</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.field}</TableCell>
                        <TableCell align="right"> <Button variant="contained">Donate</Button> </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <CustomFooter/>
     </div>

    )
}

export default Associations